import {
  workspace,
  DocumentFormattingEditProvider,
  Range,
  TextDocument,
  FormattingOptions,
  CancellationToken,
  TextEdit
} from "vscode";
import cp = require("child_process");

function fullDocumentRange(document: TextDocument): Range {
  const lastLineId = document.lineCount - 1;
  return new Range(0, 0, lastLineId, document.lineAt(lastLineId).text.length);
}

function format(document: TextDocument): Promise<string> {
  return new Promise((resolve, reject) => {
    const cmd = `mix format ${document.fileName} --print`;
    const cwd = workspace.rootPath ? workspace.rootPath : "";
    cp.exec(
      cmd,
      {
        cwd
      },
      function(error, stdout, stderr) {
        return resolve(stdout);
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
  ): Promise<TextEdit[]> {
    return format(document).then(newText => [
      TextEdit.replace(fullDocumentRange(document), newText)
    ]);
  }
}
