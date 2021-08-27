const
  alpha = /[a-zA-Z]/,
  digit = /[0-9]/,
  letter = choice(alpha, '_')

module.exports = grammar({
  name: 'act',

  word: $ => $.identifier,

  extras: $ => [
    $.comment,
    /\s/
  ],

  conflicts: $ => [
    [$.expression]
  ],

  rules: {

    source_file: $ => repeat1($.transition),

    identifier: $ => token(seq(letter, repeat(choice(letter, digit)))),
    number: $ => token(repeat1(digit)),

    transition: $ => choice($.constructor, $.behaviour),

    comment: $ => token(seq('//', /.*/)),

    mapping_lookup : $ => seq(field('name', $.identifier), field('indices', repeat1(seq('[', $.expression, ']')))),
    pre_post : $ => choice(seq('pre(', $.storage_location, ')'), seq('post(', $.storage_location, ')')),
    storage_location : $ => choice($.identifier, $.mapping_lookup),
    storage_update : $ => seq($.storage_location, '=>', $.expression),

    behaviour: $ => seq(
      'behaviour', field('name', $.identifier), 'of', field('contract', $.identifier),
      $.interface,
      optional(repeat(choice($.iff, $.iff_in_range))),
      choice($.cases, $.case_entry),
      optional($.ensures)
    ),

    constructor: $ => seq(
      'constructor of', field('contract', $.identifier),
      $.interface,
      optional(repeat(choice($.iff, $.iff_in_range))),
      optional($.creates),
      optional($.ensures),
      optional($.invariants)
    ),

    interface: $ => seq('interface', field('name', $.identifier), field('args', $.parameter_list)),
    parameter_list: $ => seq('(', optional(seq(commaSep($.parameter_declaration))), ')'),
    parameter_declaration: $ => seq($.type, ' ', $.identifier),

    iff: $ => seq('iff', repeat1($.expression)),
    iff_in_range: $ => seq('iff in range', $.atom, repeat1($.expression)),
    ensures: $ => seq('ensures', repeat1($.expression)),
    invariants: $ => seq('invariants', repeat1($.expression)),
    returns: $ => seq('returns', $.expression),
    storage: $ => seq('storage', repeat1($.storage_entry)),
    storage_entry: $ => choice($.storage_location, $.storage_update),

    creates: $ => seq('creates', repeat1($.assignment)),
    assignment: $ => seq($.type, $.identifier, ':=', choice($.expression, $.multi_assign)),
    multi_assign: $ => seq('[', optional(seq(commaSep($.defn))), ']'),
    defn: $ => seq($.expression, ':=', $.expression),

    cases: $ => repeat1(seq('case ', $.expression, ':', $.case_entry)),
    case_entry: $ => seq(choice($.storage, $.returns, seq($.storage, $.returns))),

    expression: $ => choice(
      // literals
      $.storage_location,
      $.number,
      $.bool,
      $.env,
      $.pre_post,

      // booleans
      prec.left(1, seq($.expression, 'and', $.expression)),
      prec.left(1, seq($.expression, 'or', $.expression)),
      seq($.expression, '=>', $.expression),
      seq('not', $.expression),
      seq($.expression, '<', $.expression),
      seq($.expression, '<=', $.expression),
      seq($.expression, '>=', $.expression),
      seq($.expression, '>', $.expression),
      prec.left(1, seq($.expression, '==', $.expression)),
      prec.left(1, seq($.expression, '=/=', $.expression)),

      // integers
      prec.left(1, seq($.expression, '+', $.expression)),
      prec.left(1, seq($.expression, '-', $.expression)),
      prec.left(1, seq($.expression, '*', $.expression)),
      prec.left(1, seq($.expression, '/', $.expression)),
      seq($.expression, '%', $.expression),
      prec.left(1, seq($.expression, '^', $.expression)),
    ),

    type: $ => choice($.atom, $.mapping),
    mapping: $ => seq('mapping', '(', $.atom, '=>', $.type, ')'),
    atom: $ => choice(
      'address',
      'bool',

      // ints
      'int',
      'int8',
      'int16',
      'int24',
      'int32',
      'int40',
      'int48',
      'int56',
      'int64',
      'int72',
      'int80',
      'int88',
      'int96',
      'int104',
      'int112',
      'int120',
      'int128',
      'int136',
      'int144',
      'int152',
      'int160',
      'int168',
      'int178',
      'int184',
      'int192',
      'int200',
      'int208',
      'int216',
      'int224',
      'int232',
      'int240',
      'int248',
      'int256',

      // uints
      'uint',
      'uint8',
      'uint16',
      'uint24',
      'uint32',
      'uint40',
      'uint48',
      'uint56',
      'uint64',
      'uint72',
      'uint80',
      'uint88',
      'uint96',
      'uint104',
      'uint112',
      'uint120',
      'uint128',
      'uint136',
      'uint144',
      'uint152',
      'uint160',
      'uint168',
      'uint178',
      'uint184',
      'uint192',
      'uint200',
      'uint208',
      'uint216',
      'uint224',
      'uint232',
      'uint240',
      'uint248',
      'uint256',

      // strings / bytes
      'string',
      'bytes',
      'bytes1',
      'bytes2',
      'bytes3',
      'bytes4',
      'bytes5',
      'bytes6',
      'bytes7',
      'bytes8',
      'bytes9',
      'bytes10',
      'bytes11',
      'bytes12',
      'bytes13',
      'bytes14',
      'bytes15',
      'bytes16',
      'bytes17',
      'bytes18',
      'bytes19',
      'bytes20',
      'bytes21',
      'bytes22',
      'bytes23',
      'bytes24',
      'bytes25',
      'bytes26',
      'bytes27',
      'bytes28',
      'bytes29',
      'bytes30',
      'bytes31',
      'bytes32',
    ),

    bool: $ => choice('true', 'false'),
    env: $ => choice(
      'CALLER',
      'CALLVALUE',
      'CALLDEPTH',
      'ORIGIN',
      'BLOCKHASH',
      'BLOCKNUMBER',
      'DIFFICULTY',
      'CHAINID',
      'GASLIMIT',
      'COINBASE',
      'TIMESTAMP',
      'THIS',
      'NONCE'
    ),
  }
});

function commaSep(rule) {
  return optional(commaSep1(rule))
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)))
}
