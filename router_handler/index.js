// 请求
const axios = require('axios');
const fs = require('fs')
const path = require('path')

// 替换为你的API密钥
const API_KEY = '4d28442a-106b-4c28-b41d-6b3617d8fb75';


exports.getWordAudio = (req, res) => {
    console.log('调用了----------------')
    const word = req.params.word
    const mp3_path = path.join(__dirname, `../assets/audio/${word}_pronunciation.mp3`)

    try {
        fs.accessSync(mp3_path, fs.constants.F_OK)
        console.log('文件存在')
        res.send({
            status: 0,
            msg: '获取音频成功',
            data: `./assets/audio/${word}_pronunciation.mp3`
        })
    } catch (err) {
        console.log('文件不存在')
         // 构建API请求URL
        const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API_KEY}`;
        axios.get(url)
            .then(response => {
                const data = response.data;
                if (Array.isArray(data) && data.length > 0) {
                    // 检查第一个结果是否有音频发音
                    const firstEntry = data[0];
                    // console.log('这是data:\n' + data)
                    if (firstEntry.hwi.prs[0].sound && firstEntry.hwi.prs[0].sound.audio) {
                        const audioFile = firstEntry.hwi.prs[0].sound.audio;
                        console.log(`Audio pronunciation for ${word}:`);

                        // 根据文档，音频文件可以通过以下URL访问
                        const audioUrl = `https://media.merriam-webster.com/audio/prons/en/us/mp3/${audioFile.charAt(0)}/${audioFile}.mp3`;

                        console.log(audioUrl);

                        // 如果需要下载音频文件，可以使用如下代码
                        const path = require('path');
                        const fs = require('fs');
                        const download = (url, dest) => {
                            return axios({
                                method: 'get',
                                url: url,
                                responseType: 'stream'
                            }).then(response => {
                                return new Promise((resolve, reject) => {
                                    response.data.pipe(fs.createWriteStream(dest))
                                        .on('finish', resolve)
                                        .on('error', reject);
                                });
                            });
                        };

                        const destinationPath = path.join(__dirname, `../assets/audio/${word}_pronunciation.mp3`);
                        download(audioUrl, destinationPath).then(() => {
                            res.send({
                            status: 0,
                            msg: '获取音频成功',
                            data: `./assets/audio/${word}_pronunciation.mp3`
                            })
                        }).catch(error => {
                            console.error(`Error downloading audio file: ${error.message}`);
                            res.send({
                                status: 0,
                                msg: '请确认单词是否正确',
                                data: ''
                            })
                        });
                    } else {
                        console.log("No audio pronunciation found.");
                        res.send({
                            status: 0,
                            msg: '请确认单词是否正确',
                            data: ''
                        })
                    }
                } else {
                    console.log("No results found.");
                    res.send({
                        status: 0,
                        msg: '请确认单词是否正确',
                        data: ''
                    })
                }
            })
            .catch(error => {
                console.error(`Error fetching data from Merriam-Webster: ${error.message}`);
                res.send({
                    status: 0,
                    msg: '请确认单词是否正确',
                    data: ''
                })
            });
    }  
}