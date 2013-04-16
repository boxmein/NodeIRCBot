#include <iostream>
#include <string>


int main () {
  int i;
	std::string x; 

	for (i=0;i<1000;i++) {
		std::cout << "Hello world" << std::endl;
		std::cin >> x; 
		std::cout.flush();
	}
	return 0;
}

// g++ -o hello hello.cpp
// g++ -o hello.exe hello.cpp 

