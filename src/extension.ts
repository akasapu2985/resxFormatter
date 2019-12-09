// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import xmljs = require("xml-js");
import _ = require("lodash");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  vscode.languages.registerDocumentFormattingEditProvider("resx", {
    provideDocumentFormattingEdits: (document: vscode.TextDocument, options: vscode.FormattingOptions): vscode.ProviderResult<vscode.TextEdit[]> => {
      return new ResxFormatter(document, options).format();
    }
  });
}

class ResxFormatter {
  constructor(private document: vscode.TextDocument, options?: vscode.FormattingOptions) {}
  public format() {
    const lastLine = this.document.lineAt(this.document.lineCount - 1);
    const documentRange = new vscode.Range(this.document.positionAt(0), lastLine.range.end);
    const fullText = JSON.parse(xmljs.xml2json(this.document.getText()));
    let rootElementChildren = fullText.elements[0].elements;
    const dataElements = _.remove(rootElementChildren, (node: any) => {
      return node.name === "data";
    });
    fullText.elements[0].elements = _.concat(
      rootElementChildren,
      _.sortBy(dataElements, [
        node => {
          return node.attributes.name.toUpperCase();
        }
      ])
    );
    const selectedXml = xmljs.json2xml(fullText, { spaces: 4 });
    return [vscode.TextEdit.replace(documentRange, selectedXml)];
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
