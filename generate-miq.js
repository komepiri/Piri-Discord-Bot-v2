module.exports = {
    async generateMiqImages(username, displayName, text, avatarUrl, color) {
    const requestData = {
        username: username,             
        display_name: displayName, 
        text: text,     
        avatar: avatarUrl, 
        color: color,               
    };
    
        try {
        const response = await fetch('https://api.voids.top/fakequote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTPエラー: ${response.status}`);
        }

        const data = await response.json();
        return data.url; 
    } catch (error) {
        console.error('miq画像生成失敗:', error);
    }
  }
}