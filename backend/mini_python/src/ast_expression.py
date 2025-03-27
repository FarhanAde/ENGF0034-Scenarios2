from dataclasses import dataclass

@dataclass
class Expression:
    pass

@dataclass
class And(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Or(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Eq(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class NotEq(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Lt(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class LtE(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Gt(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class GtE(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Add(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Sub(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Mult(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Div(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class FloorDiv(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Mod(Expression):
    expr1: Expression
    expr2: Expression

@dataclass
class Not(Expression):
    expr: Expression

@dataclass
class StrExpression(Expression):
    value: str

@dataclass
class FloatExpression(Expression):
    value: float

@dataclass
class IntExpression(Expression):
    value: int

@dataclass
class BoolExpression(Expression):
    value: bool

@dataclass
class Identifier(Expression):
    value: str

@dataclass
class FunctionCall(Expression):
    function: Expression
    args: list[Expression]
