from ast_statement import Program
from parser_statement import program_parser
from program_state import run_statement, ProgramState, Ok

def run_code(code: str):
    program: Program = program_parser.parse(code)
    program_state = ProgramState()
    
    for stmt in program.statements:
        result = run_statement(stmt, program_state)
        assert isinstance(result, Ok)


example1 = """
print("hello, world!");
"""

example2 = """
i = 0;
while i < 10 {
i = i + 1;
print(i);
}
"""

example3 = """
def add_one(x) {
    return x + 1;
}
print(add_one(1));
"""

example4 = """
def myFunc(x, y) { return x + y; }

print(myFunc(1,2));
"""

example5 = """
def factorial(n) {
    if n == 0 {
        return 1;
    }
    return n * factorial(n-1);
}
print(factorial(4));
"""

run_code(example5)