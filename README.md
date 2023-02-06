# Windows 下配置 Rust WebAssembly + React 环境步骤

## 目录

- [1. 安装 Rust 编译工具](#-1-安装-rust-编译工具- )
- [2. 全局安装 wasm-pack](#-2-全局安装-wasm-pack- )
- [3. 搭建 Visual Studio Code 开发环境](#-3-搭建-visual-studio-code-开发环境- )
- [4. 创建 Rust 应用](#-4-创建-rust-应用- )
- [5. 创建 React 应用](#-5-创建-react-应用- )
- [6. 开始应用](#-6-开始应用- )

## 1. 安装 Rust 编译工具

前往 https://www.rust-lang.org/zh-CN/tools/install 下载可执行程序 `rustup-init.exe` 并直接运行。之后便跟随引导一步步安装即可。

完成这一步就完成了 Rust 的安装，可以通过以下命令测试：

```sh
rustc -V        # 注意的大写的 V
```

## 2. 全局安装 wasm-pack

```sh
cargo install wasm-pack --no-default-features # 忽略 OpenSSL
```

若出现如下错误：
```sh
"perl" "./Configure"  "--prefix=xxx\\target\\debug\\build\\openssl-sys-fa02faf7b01ccae6\\out\\openssl-build\\install" "no-dso" "no-shared" "no-ssl3" "no-unit-test" "no-comp" "no-zlib"
```
则需前往 https://strawberryperl.com 安装 Perl 后重新安装 wasm-pack。

## 3. 搭建 Visual Studio Code 开发环境
- 下载 Visual Studio Code；
- 安装 rust-analyzer、Better TOML、C/C++ 三个扩展；
- 项目根目录创建 `.vscode` 文件夹；
- `.vscode` 文件夹下创建 `tasks.json` 文件和 launch.json 文件：
```json
// tasks.json
{ 
    "version": "2.0.0",
    "tasks": [{ 
        "label": "build",
        "type": "shell",
        "command": "cargo",
        "args": ["build"]
    }]
}
```
```json
// launch.json
{ 
    "version": "0.2.0",
    "configurations": [{
        "name": "(Windows) 启动",
        "preLaunchTask": "build",
        "type": "cppvsdbg",
        "request": "launch",
        "program": "${workspaceFolder}/target/debug/${workspaceFolderBasename}.exe",
        "args": [],
        "stopAtEntry": false,
        "cwd": "${workspaceFolder}",
        "environment": [],
        "externalConsole": false
    }]
}
```
## 4. 创建 Rust 应用
- 使用 `cargo new wasm` 命令创建名为 `wasm` 的 rust 项目；
- 修改 `Cargo.toml`：
```toml
[package]
name = "wasm"
version = "0.1.0"
edition = "2021"

# See more keys and their definitions at https://doc.rust-lang.org/cargo/reference/manifest.html

[lib]
crate-type = ["cdylib"]
path ="src/lib.rs"

[package.metadata.wasm-pack.profile.release]
wasm-opt = false

[dependencies]
wasm-bindgen = "0.2.84"
```
- 将 `src` 目录下 `main.rs` 重命名或者删除之后创建 `lib.rs`；
- 编辑 `lib.rs` 内容：
<div id="rust-code"></div>
```rust
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn welcome(name: &str) {
    alert(&format!("Hello {}, from Rust!", name));
}
```
- 由于该实践为 wasm 与 react 结合的项目，因此为了支持调试 wasm 项目需修改 `.vscode` 文件夹下的配置文件：
```json
// tasks.json
{
    "version": "2.0.0",
    "tasks": [{
        "label": "build",
        "type": "shell",
        "options": {
            "cwd": "${workspaceFolder}/wasm"
        },
        "command": "cargo",
        "args": [
            "build"
        ]
    }]
}
```
```json
// launch.json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(Windows)启动",
            "preLaunchTask": "build",
            "type": "cppvsdbg",
            "request": "launch",
            "program": "${workspaceFolder}/wasm/target/debug/wasm.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${workspaceFolder}",
            "environment": [],
        },
    ]
}
```
- 一些常用的指令：
检查依赖：`cargo check`；
生成文档：`cargo doc --open`；
运行项目：`cargo run`；
打包：`wasm-pack build --target web`。

## 5. 创建 React 应用
```sh
npx create-react-app react-client --template typescript
```

**注意：为集成 wasm , 
① 保证 `react-scripts` 版本 >= 5.0.0 以确保 webpack 版本 >= 5；
② 保证 node 版本 >= 16。**

添加 react-app-rewired 与 customize-cra：
```sh
yarn add react-app-rewired customize-cra -D
```

修改 `package.json` 文件的 script：
```json
{
    ...
    "scripts": {
        "start": "react-app-rewired start",
        "build": "react-app-rewired build",
        "test": "react-scripts test",
        "eject": "react-scripts eject"
    }
    ...
}
```

项目集成 less、lodash：
```sh
yarn add lodash
yarn add @types/lodash less less-loader babel-plugin-lodash -D
```

项目根目录下创建 `config-overrides.js` 文件：
```js
/**
 * react-scripts 采用 5.0.1 版本，该版本 webpack@^5.0.0，
 * webpack@^5.0.0 无需手动配置 wasm-loader
 */

const {
    override,
    disableEsLint,
    setWebpackOptimizationSplitChunks,
    addWebpackAlias,
    addWebpackResolve,
    addWebpackModuleRule,
    addBabelPlugin
} = require('customize-cra');

const path = require('path');

/**
 * customize-cra 的 addLessLoader 在 webpack5 中存在 bug，
 * 因此这里使用 addWebpackModuleRule 进行替换
 */
function addLessLoader(options) {
    return addWebpackModuleRule({
        test: /\.less$/,
        use: [
            'style-loader',
            'css-loader',
            'postcss-loader',
            {
                loader: 'less-loader',
                options,
            },
        ],
    });
}

module.exports = {
    webpack: override(
        disableEsLint(),
        // 抽出公共模块
        setWebpackOptimizationSplitChunks({
            // 这里设置为 all 会出现 bug
            chunks: 'async',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                },
            },
        }),
        addLessLoader({
            lessOptions: {
                javascriptEnabled: true,
            },
        }),
        addBabelPlugin('lodash')
    ),
};

```

引入 wasm ：
在 `package.json` 文件中追加 "wasm":"file:../wasm/pkg"：
```json
{
    ...
    "dependencies": {
        ...
        "wasm":"file:../wasm/pkg"
        ...
    }
}
```
执行 `yarn` 更新依赖。

至此 Rust WebAssembly + React 环境配置完毕。

## 6. 开始应用
以该文档中 [lib.rs](#rust-code) 的代码为例。
在使用前需确保已加载 `.wasm` 文件：
```ts
import wasmInit, { welcome } from 'wasm';

function Home() {
    async function hello() {
        try {
            await wasmInit();
            welcome?.('你好');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <button onClick={hello}>
            你好
        </button>
    );
}

export default Home;
```
通过 `wasmInit()` 加载 `.wasm` 文件后才可使用 wasm 中暴露出的方法。
点击按钮后页面弹出：`Hello 你好, from Rust!` 的 弹窗。

当然若像上述代码这样每次点击按钮都重新加载 `.wasm` 文件，自然会造成资源的浪费。因此需要你自行封装一套 wasm 管理模式对此进行优化。
例如：
```ts
// wasm.ts
import wasmInit, * as wasm from 'wasm';

class WasmService {
    private loaded = false;

    public async init() {
        try {
            if (!this.loaded) {
                await wasmInit();
                this.loaded = true;
            }
        } catch (error) {
            this.loaded = false;
        }
    }

    public getWasms(): Partial<typeof wasm> {
        if (!this.loaded) {
            return {};
        }
        return wasm || {};
    }
}

const wasmService = new WasmService();

export default wasmService;
```
在项目入口处调用 `wasmService.init()` 进行 `.wasm` 文件加载，在使用时可通过：
```ts
const { welcome } = wasmService.getWasms();

welcome?.('你好');
```
进行调用。

当然在 React 项目中也可通过 createContext 的方式将其封装成一个全局 `hooks`，此处便不过多赘述。