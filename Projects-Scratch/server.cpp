#include <windows.h>
#include <iostream>
#include <bits/stdc++.h>

// 以管理员权限运行才能清理所有缓存
void clearPortCache() {
	// 1. 释放所有 TIME_WAIT 状态的连接（清理端口占用残留）
	//    注意：netsh int ip reset 需要管理员权限，重启后生效
	//    这里用更温和的方式：重置 TCP/IP 栈的端口状态
	system("netsh int ip reset >nul 2>&1");
	
	// 2. 清理 DNS 缓存
	system("ipconfig /flushdns >nul 2>&1");
	
	// 3. 清理 ARP 缓存
	system("netsh interface ip delete arpcache >nul 2>&1");
	
	// 4. 查看当前端口占用情况（调试用，可选）
	// system("netstat -ano | findstr TIME_WAIT");
}

int main() {
	// 先清理缓存
	clearPortCache();
	// �޸�����ַ�����Ԥ���㹻�ռ䲢���� -c-1
	char x[32] = "npx http-server -p ";
	// ... �˿ڼ����߼����� ...
	
	// �ڶ˿ں���׷�ӽ��û���Ĳ���
	strcat(x, " -c-1");
	int a = time(0) % 10, b = rand() % 10;
	x[19] = char('0' + a * b * b * 999884 % 10);
	x[20] = char('0' + b * 13555 % 10);
	x[21] = char('0' + a * b * 9967 % 10);
	x[22] = char('0' + a * a * b * 4565 % 10);
	x[23] = '\0';  // 确保字符串结尾
	
	std::cout << "启动命令: " << x << std::endl;
	system(x);
	return 0;
}
