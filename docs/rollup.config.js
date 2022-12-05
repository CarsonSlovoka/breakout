// 如果rollup指令出錯，請更新node還有npm
// - 更新node: `choco upgrade nodejs`
// - 更新npm: `npm install -g npm`
//
// npm list -g rollup // 查看版號
// npm install uglify-js -g // 安裝uglifyjs
// npm list -g uglify-js
const version = "1.0.0";
export default {
    input: '../docs/app/index.mjs',
    output: [
        {
            file: '../docs/app/bundle.js',
            format: 'es',
            banner: `// https://github.com/CarsonSlovoka/ v${version} Copyright (c) Carson, all right reserved.`,
            // footer: '// powered by Carson'
        }
    ]
};
