import { languages, ExtensionContext } from "vscode";
import EditProvider from "./edit-provider";

export function activate(context: ExtensionContext) {
  const editProvider = new EditProvider();
  context.subscriptions.push(
    languages.registerDocumentFormattingEditProvider("elixir", editProvider)
  );
}
