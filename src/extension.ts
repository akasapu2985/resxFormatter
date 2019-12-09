// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import xmljs = require('xml-js');

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
	constructor(private document: vscode.TextDocument, options?: vscode.FormattingOptions) {
	}
	public format() {
		const lastLine = this.document.lineAt(this.document.lineCount - 1);
		const documentRange = new vscode.Range(this.document.positionAt(0), lastLine.range.end);
		const fullText = JSON.parse(xmljs.xml2json(this.document.getText()));
		let resxElements = fullText.elements[0].elements;
		fullText.elements[0].elements = resxElements.sort((a: any, b: any) => {
			var nameA = a.attributes.name.toUpperCase(); // ignore upper and lowercase
			var nameB = b.attributes.name.toUpperCase(); // ignore upper and lowercase
			if (nameA < nameB) {
				return -1;
			}
			if (nameA > nameB) {
				return 1;
			}
		});
		const selectedXml = xmljs.json2xml(fullText, { spaces: 4 });
		return [vscode.TextEdit.replace(documentRange, selectedXml)];
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
