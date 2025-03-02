#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

/**
 * ディレクトリ内のファイルを統合して一つのファイルに出力する関数
 * @param {string} dirName - 統合するファイルが含まれるディレクトリ名
 * @param {string} outputFileName - 出力ファイル名（.を含む）
 * @returns {string} 出力ファイルのパス
 */
async function integrateFiles(dirName, outputFileName) {
  try {
    console.log(`${dirName}ディレクトリの内容を統合します...`);

    // ディレクトリパスの設定
    const sourceDir = path.join(__dirname, dirName);
    const outputDir = path.join(__dirname, dirName, "output");
    const outputFile = path.join(outputDir, outputFileName);

    // ディレクトリ内のmdファイルを取得
    const files = fs
      .readdirSync(sourceDir)
      .filter(
        (file) =>
          file.endsWith(".md") &&
          fs.statSync(path.join(sourceDir, file)).isFile()
      );

    if (files.length === 0) {
      console.warn(`警告: ${sourceDir} 内にmdファイルが見つかりません。`);
      return;
    }

    // outputディレクトリが存在するか確認し、なければ作成
    if (!fs.existsSync(outputDir)) {
      console.log(`${outputDir} ディレクトリを作成します...`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 各ファイルの内容を読み込み、統合する
    let integratedContent = "";

    for (const fileName of files) {
      const filePath = path.join(sourceDir, fileName);
      console.log(`${fileName} を読み込んでいます...`);

      const content = fs.readFileSync(filePath, "utf8");
      integratedContent += `\n\n# ${path
        .basename(fileName, ".md")
        .toUpperCase()} からの内容\n\n`;
      integratedContent += content;
      integratedContent += "\n\n---\n";
    }

    // 統合した内容を出力ファイルに書き込む
    console.log(`統合した内容を ${outputFile} に書き込んでいます...`);
    fs.writeFileSync(outputFile, integratedContent.trim(), "utf8");

    console.log(`${dirName}ディレクトリの統合が完了しました！`);
    return outputFile;
  } catch (error) {
    console.error(
      `${dirName}ディレクトリの統合中にエラーが発生しました:`,
      error
    );
    return null;
  }
}

/**
 * 各ディレクトリの出力ファイルを統合して一つのファイルに出力する関数
 * @param {string[]} filePaths - 統合するファイルのパスの配列
 * @param {string} outputFilePath - 出力ファイルのパス
 */
async function integrateAllRules(filePaths, outputFilePath) {
  try {
    console.log("すべてのルールファイルを統合します...");

    // 出力ディレクトリが存在するか確認し、なければ作成
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
      console.log(`${outputDir} ディレクトリを作成します...`);
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 各ファイルの内容を読み込み、統合する
    let integratedContent = "";

    for (const filePath of filePaths) {
      if (fs.existsSync(filePath)) {
        console.log(`${filePath} を読み込んでいます...`);
        const content = fs.readFileSync(filePath, "utf8");

        // ファイル名からディレクトリ名を抽出
        const dirName = path.basename(path.dirname(path.dirname(filePath)));
        integratedContent += `\n\n# ${dirName.toUpperCase()} ディレクトリのルール\n\n`;
        integratedContent += content;
        integratedContent += "\n\n---\n";
      } else {
        console.warn(`警告: ${filePath} が見つかりません。スキップします。`);
      }
    }

    // 統合した内容を出力ファイルに書き込む
    console.log(`統合した内容を ${outputFilePath} に書き込んでいます...`);
    fs.writeFileSync(outputFilePath, integratedContent.trim(), "utf8");

    console.log("すべてのルールファイルの統合が完了しました！");
  } catch (error) {
    console.error("ルールファイルの統合中にエラーが発生しました:", error);
  }
}

// メイン関数
async function main() {
  try {
    console.log("ファイル統合処理を開始します...");

    // 各ディレクトリの処理
    const generalRulesPath = await integrateFiles("general", ".clinerules");
    const frameworkRulesPath = await integrateFiles(
      "framework",
      ".framework-rules"
    );
    const languageRulesPath = await integrateFiles(
      "language",
      ".language-rules"
    );

    console.log("すべてのディレクトリの統合が完了しました！");

    // 最終的な統合ファイルのパス
    const finalOutputPath = path.join(__dirname, ".clinerules");

    // すべてのルールファイルを統合
    await integrateAllRules(
      [generalRulesPath, frameworkRulesPath, languageRulesPath].filter(Boolean),
      finalOutputPath
    );

    console.log(`すべてのルールが ${finalOutputPath} に統合されました！`);
  } catch (error) {
    console.error("エラーが発生しました:", error);
    process.exit(1);
  }
}

// スクリプトを実行
main();
