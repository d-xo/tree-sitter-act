; comment
; tag
; embedded
; punctuation.delimiter
; constant.builtin
; operator
; variable.parameter
; property
; constant
; keyword
; string
; constructor
; number
; function.builtin
; attribute
; string.special
; type.builtin
; variable.builtin
; function
; type
; punctuation.bracket

"behaviour" @keyword
"constructor of" @keyword
"interface" @keyword
"of" @keyword
(iff "iff" @keyword)
(iff_in_range "iff in range" @keyword)
"creates" @keyword
"returns" @keyword
"case " @keyword
"storage" @keyword
"invariants" @keyword
"ensures" @keyword
(pre_post) @operator

(atom) @type
(mapping "mapping" @type)

(assignment (type) (identifier) @variable.parameter*)

(behaviour
  name: (identifier) @function.method
  contract: (identifier) @contract
)

(constructor
  contract: (identifier) @contract
)

(interface
  name: (identifier) @function.method
  args: (parameter_list
          (parameter_declaration
            (type) @type
            (identifier) @variable.parameter)*
))

(storage_location (identifier) @variable.parameter)
(storage_location (mapping_lookup (identifier) @variable.parameter))
(comment) @comment
(number) @number
(bool) @constant
(env) @constant

"and" @operator
"or" @operator
"+" @operator
"-" @operator
">" @operator
">=" @operator
"<" @operator
"<=" @operator
"*" @operator
"-" @operator
"*" @operator
"/" @operator
"%" @operator
"^" @operator
"==" @operator
"=/=" @operator
"=>" @operator
":=" @operator

"[" @punctuation.bracket
"]" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket

"," @punctuation.delimiter
