from dataclasses import dataclass
from typing import Callable
from ast_expression import *
from ast_statement import *

class InterpreterRuntimeError(Exception):
    pass

class TypeMismatchError(InterpreterRuntimeError):
    pass

class ComparisionError(InterpreterRuntimeError):
    pass

class UndefinedError(InterpreterRuntimeError):
    pass

class NoReturnStatementError(InterpreterRuntimeError):
    pass

class InvalidNumberOfArgumentsError(InterpreterRuntimeError):
    pass

class BreakOutsideLoopError(InterpreterRuntimeError):
    pass

class ContinueOutsideLoopError(InterpreterRuntimeError):
    pass

class ProgramState:
    def __init__(self):
        self.stack: list[dict[str, 'Variable']] = [{}]
        self.load_default_variables()
    
    def load_default_variables(self):
        def program_print(args: list[Variable], _: ProgramState):
            print(args)
        self.assign_variable("print", FunctionVariable(program_print))

    def add_scope(self):
        self.stack.append({})
        
    def drop_scope(self):
        pass

    def assign_variable(self, key: str, value: 'Variable'):
        for scope in reversed(self.stack):
            if key in scope:
                scope[key] = value
                return
        
        latest_scope = self.stack[-1]
        latest_scope[key] = value

    def get_variable(self, key: str) -> 'Variable':
        for scope in reversed(self.stack):
            if key in scope:
                return scope[key]
        raise UndefinedError


class Variable:
    pass

@dataclass
class StringVariable(Variable):
    value: str

@dataclass
class IntVariable(Variable):
    value: int

@dataclass
class FloatVariable(Variable):
    value: float

@dataclass
class BoolVariable(Variable):
    value: bool

@dataclass
class FunctionVariable(Variable):
    value: Callable[[list[Variable], ProgramState], Variable]


class StatementResult:
    pass

@dataclass
class Ok(StatementResult):
    pass

@dataclass
class Return(StatementResult):
    value: Variable

@dataclass
class Continue(StatementResult):
    pass

@dataclass
class Break(StatementResult):
    pass

def to_bool(variable: Variable) -> bool:
    if isinstance(variable, BoolVariable):
        return variable.value
    raise TypeMismatchError(f"tried to convert {variable} to bool")

def to_function(variable: Variable) -> Callable[[list[Variable], ProgramState], Variable]:
    if isinstance(variable, FunctionVariable):
        return variable.value
    raise TypeMismatchError(f"the variable {variable} is not a function")

def compare_variables(var1: Variable, var2: Variable, comparator: Callable) -> bool:
    if isinstance(var1, StringVariable) and isinstance(var2, StringVariable):
        return comparator(var1.value, var2.value)
    if isinstance(var1, BoolVariable) and isinstance(var2, BoolVariable):
        return comparator(var1.value, var2.value)
    if isinstance(var1, (FloatVariable, IntVariable)) and isinstance(var2, (FloatVariable, IntVariable)):
        return comparator(var1.value, var2.value)
    raise TypeMismatchError(f"var1 {var1} and var2 {var2} have incompativle types for comparison")

def compare(expr: Eq | NotEq | Lt | LtE | Gt | GtE, comparator: Callable, program_state: ProgramState) -> BoolVariable:
    var1 = eval_expression(expr.expr1, program_state)
    var2 = eval_expression(expr.expr2, program_state)
    return BoolVariable(compare_variables(var1, var2, comparator))

def numerical_operation_variables(var1: Variable, var2: Variable, operation: Callable) -> Variable:
    if isinstance(var1, IntVariable) and isinstance(var2, IntVariable):
        return IntVariable(operation(var1.value, var2.value))
    if isinstance(var1, (FloatVariable, IntVariable)) and isinstance(var2, (FloatVariable, IntVariable)):
        return FloatVariable(operation(var1.value, var2.value))
    raise TypeMismatchError

def numerical_operation(expr: Add | Sub | Mult | Div | FloorDiv | Mod, operation: Callable, program_state: ProgramState) -> Variable:
    var1 = eval_expression(expr.expr1, program_state)
    var2 = eval_expression(expr.expr2, program_state)
    return numerical_operation_variables(var1, var2, operation)

def eval_expression(expr: Expression, program_state: ProgramState) -> Variable:
    match expr:
        case And():
            return BoolVariable(to_bool(eval_expression(expr.expr1, program_state)) and to_bool(eval_expression(expr.expr2, program_state)))
        case Or():
            return BoolVariable(to_bool(eval_expression(expr.expr1, program_state)) or to_bool(eval_expression(expr.expr2, program_state)))
        case Eq():
            return compare(expr, lambda a,b: a == b, program_state)
        case NotEq():
            return compare(expr, lambda a,b: a != b, program_state)
        case Lt():
            return compare(expr, lambda a,b: a < b, program_state)
        case LtE():
            return compare(expr, lambda a,b: a <= b, program_state)
        case Gt():
            return compare(expr, lambda a,b: a > b, program_state)
        case GtE():
            return compare(expr, lambda a,b: a >= b, program_state)
        case Add():
            return numerical_operation(expr, lambda a,b: a + b, program_state)
        case Sub():
            return numerical_operation(expr, lambda a,b: a - b, program_state)
        case Mult():
            return numerical_operation(expr, lambda a,b: a * b, program_state)
        case Div():
            raise NotImplementedError
        case FloorDiv():
            raise NotImplementedError
        case Mod():
            return numerical_operation(expr, lambda a,b: a % b, program_state)
        case Not():
            return BoolVariable(not to_bool(eval_expression(expr.expr, program_state)))
        case StrExpression():
            return StringVariable(expr.value)
        case BoolExpression():
            return BoolVariable(expr.value)
        case IntExpression():
            return IntVariable(expr.value)
        case FloatExpression():
            return FloatVariable(expr.value)
        case Identifier():
            return program_state.get_variable(expr.value)
        case FunctionCall():
            func = to_function(eval_expression(expr.function, program_state))
            args = [eval_expression(e, program_state) for e in expr.args]
            return func(args, program_state)
    
    raise NotImplementedError

def run_statement(statement: Statement, program_state: ProgramState) -> StatementResult:
    match statement:
        case Block():
            for stmt in statement.statements: 
                result = run_statement(stmt, program_state)
                if not isinstance(result, Ok):
                    return result
            return Ok()

        case AssignmentStatement():
            variable = eval_expression(statement.expression, program_state)
            program_state.assign_variable(statement.identifier.value, variable)
            return Ok()

        case ExpressionStatement():
            eval_expression(statement.expression, program_state)
            return Ok()

        case BreakStatement():
            return Break()
        
        case ContinueStatement():
            return Continue()
        
        case ReturnStatement():
            variable = eval_expression(statement.expression, program_state)
            return Return(variable)
        
        case IfStatement():
            if to_bool(eval_expression(statement.condition, program_state)):
                return run_statement(statement.block, program_state)
            return run_statement(statement.else_block, program_state)

        case WhileStatement():
            while to_bool(eval_expression(statement.condition, program_state)):
                result = run_statement(statement.block, program_state)
                if isinstance(result, Return):
                    return result
                if isinstance(result, Continue):
                    continue
                if isinstance(result, Break):
                    break
            return Ok()

        case FunctionDeclaration():
            identifier = statement.identifier
            parameters = statement.parameters
            block = statement.block

            user_function = define_user_function(parameters, block)
            program_state.assign_variable(identifier.value, user_function)
            return Ok()
    
    raise NotImplementedError


def define_user_function(parameters: list[Identifier], block: Block) -> FunctionVariable:

    def run(args: list[Variable], program_state: ProgramState) -> Variable:
        
        if len(args) != len(parameters):
            raise InvalidNumberOfArgumentsError
        
        program_state.add_scope()
        
        for arg, param in zip(args, parameters):
            program_state.assign_variable(param.value, arg)
        
        for stmt in block.statements:
            result = run_statement(stmt, program_state)
            if isinstance(result, Return):
                program_state.drop_scope()
                return result.value
            if isinstance(result, Break):
                raise BreakOutsideLoopError
            if isinstance(result, Continue):
                raise ContinueOutsideLoopError
        
        raise NoReturnStatementError
    
    return FunctionVariable(run)