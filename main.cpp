#include <iostream>
#include <iomanip>
using namespace std;
double add(auto a,auto b)
{
    return a+b;
}
double subtract(auto a,auto b)
{
    return a-b;
}
double multiply(auto a,auto b)
{
    return a*b;
}
double divide(auto a,auto b)
{
    if (b == 0)
    {
        cout<<"Error: division by zero is not allowed."<<endl;
        return a;
    }
    return a/b;
}
int main(){
    double a;
    char ch;
    while(true)
    {
        
        abc:
        cout<<"enter a number : ";
        cin>>a;
        ch=0;
        while(true)
        {
            double b=0;
            cout<<"press + to add, - to subtract, x to multiply, / to divide (no division by zero), r to restart, e to exit : ";
            cin>>ch;
            switch(ch)
            {
                case '+': cout<<"enter next number : ";
                        cin>>b;
                        a=add(a,b);
                        cout<<"result : "<<a<<endl;
                break;
                case '-': cout<<"enter next number : ";
                        cin>>b;
                        a=subtract(a,b);
                        cout<<"result : "<<a<<endl;
                break;
                case 'x': cout<<"enter next number : ";
                        cin>>b;
                        a=multiply(a,b);
                        cout<<"result :"<<a<<endl;
                break;
                case '/': cout<<"enter next number : ";
                        cin>>b;
                        a=divide(a,b);
                        cout<<"result :"<<a<<endl;
                break;
                case 'r': goto abc; 
                break; 
                case 'e': goto zxy;
                break;
                default: cout<<"invalid operator"<<endl;
                break;
            }
        }
        
    }
    zxy:;
    return 0;
}
