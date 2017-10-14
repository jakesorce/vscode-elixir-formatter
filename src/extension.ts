"use strict";
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import cp = require("child_process");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const formatDocument = function(
    document: vscode.TextDocument
  ): Thenable<vscode.TextEdit[]> {
    return new Promise((resolve, reject) => {
      let filename = document.fileName;
      var cmd = `mix format ${document.fileName}`;
      console.log(`cmd line:${cmd}`);
      const cwd = vscode.workspace.rootPath ? vscode.workspace.rootPath : "";
      cp.exec(
        cmd,
        {
          cwd
        },
        function(error, stdout, stderr) {
          if (error !== null) {
            const message = `Cannot format due to syntax errors.: ${stderr}`;
            console.log(`exec error: ${stderr}`);
            vscode.window.showErrorMessage(message);
            return reject(message);
          } else {
            let textEdits: vscode.TextEdit[] = [];
            return resolve(textEdits);
          }
        }
      );
    });
  };
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "vscode-elixir-formatter" is now active!'
  );

  let formatter = vscode.languages.registerDocumentFormattingEditProvider(
    "elixir",
    {
      provideDocumentFormattingEdits: function(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
      ): Thenable<vscode.TextEdit[]> {
        return document.save().then(() => {
          return formatDocument(document);
        });
      }
    }
  );
  context.subscriptions.push(formatter);
}
