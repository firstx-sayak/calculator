#include <cmath>
#include <cctype>
#include <algorithm>
#include <iostream>

using namespace std;

double add(double a, double b)
{
    return a + b;
}

double subtract(double a, double b)
{
    return a - b;
}

double multiply(double a, double b)
{
    return a * b;
}

double divide(double a, double b)
{
    return a / b;
}

double power(double base, double exponent)
{
    return pow(base, exponent);
}

double modulo(double a, double b)
{
    return fmod(a, b);
}

double average(double a, double b)
{
    return (a + b) / 2.0;
}

double maximum(double a, double b)
{
    return max(a, b);
}

double prompt_operand()
{
    double value{};
    cout << "enter next number : ";
    cin >> value;
    return value;
}

void print_options()
{
    cout << "press + to add, - to subtract, x to multiply, / to divide, % for modulo, p for power, v for average, m for max, r to restart, e to exit : ";
}

void report_result(double value)
{
    cout << "result : " << value << endl;
}

int main()
{
    while (true)
    {
        double accumulator{};
        cout << "enter a number : ";
        cin >> accumulator;

        while (true)
        {
            char ch{};
            print_options();
            cin >> ch;
            char command = tolower(static_cast<unsigned char>(ch));

            if (command == 'e')
            {
                return 0;
            }

            if (command == 'r')
            {
                break;
            }

            double next_value{};
            if (command == '%' || command == '/' || command == '+' || command == '-' || command == 'x' || command == 'p' || command == 'v' || command == 'm')
            {
                next_value = prompt_operand();
            }
            else
            {
                cout << "unknown command" << endl;
                continue;
            }

            switch (command)
            {
                case '+':
                    accumulator = add(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case '-':
                    accumulator = subtract(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case 'x':
                    accumulator = multiply(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case '/':
                    if (next_value == 0)
                    {
                        cout << "cannot divide by zero" << endl;
                        continue;
                    }
                    accumulator = divide(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case '%':
                    if (next_value == 0)
                    {
                        cout << "cannot modulo by zero" << endl;
                        continue;
                    }
                    accumulator = modulo(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case 'p':
                    accumulator = power(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case 'v':
                    accumulator = average(accumulator, next_value);
                    report_result(accumulator);
                    break;
                case 'm':
                    accumulator = maximum(accumulator, next_value);
                    report_result(accumulator);
                    break;
                default:
                    cout << "unknown command" << endl;
                    break;
            }
        }
    }
}
