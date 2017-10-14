import {
  workspace,
  DocumentFormattingEditProvider,
  Range,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  TextEdit,
  window,
  Position
} from "vscode";
import cp = require("child_process");

function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  return new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

function format(document: TextDocument): Promise<TextEdit[]> {
  return new Promise((resolve, reject) => {
    const cmd = `mix format ${document.fileName}`;
    const cwd = workspace.rootPath ? workspace.rootPath : "";
    cp.exec(
      cmd,
      {
        cwd
      },
      function(error, stdout, stderr) {
        if (error !== null) {
          const message = `Cannot format due to syntax errors.: ${stderr}`;
          window.showErrorMessage(message);
          return reject(message);
        } else {
          return [TextEdit.replace(fullDocumentRange(document), stdout)];
        }
      }
    );
  });
}

export default class PrettierEditProvider
  implements DocumentFormattingEditProvider {
  provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions,
    token: CancellationToken
  ): Thenable<TextEdit[]> {
    return document.save().then(() => {
      return format(document);
    });
  }
}
