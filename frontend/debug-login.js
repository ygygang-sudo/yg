// 调试脚本：检查登录过程中的状态变化
const axios = require('axios');

async function debugLogin() {
  try {
    console.log('1. 发送登录请求...');
    const loginResponse = await axios.post('http://localhost:8000/api/user/login', 
      'username=admin&password=admin123',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    console.log('2. 登录API响应:', JSON.stringify(loginResponse.data, null, 2));
    
    // 检查用户信息结构
    const userInfo = loginResponse.data.data.userInfo;
    console.log('3. 用户信息结构检查:');
    console.log('   - role字段:', userInfo.role);
    console.log('   - role类型:', typeof userInfo.role);
    console.log('   - 所有字段:', Object.keys(userInfo));
    
    // 检查token
    console.log('4. Token检查:');
    console.log('   - token:', loginResponse.data.data.token ? '存在' : '不存在');
    
  } catch (error) {
    console.error('调试过程中出错:', error.message);
  }
}

debugLogin();