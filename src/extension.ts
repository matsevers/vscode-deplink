// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { CargoLinkProvider } from './LinkProvider/CargoLinkProvider';
import { ComposerLinkProvider } from './LinkProvider/ComposerLinkProvider';
import { NpmLinkProvider } from './LinkProvider/NpmLinkProvider';
import { PubSpecLinkProvider } from './LinkProvider/PubSpecLinkProvider';
import { PypiLinkProvider } from './LinkProvider/PypiLinkProvider';


export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: "json", pattern: '**/package.json' }, new NpmLinkProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ pattern: '**/Cargo.toml' }, new CargoLinkProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ pattern: '**/requirements.txt' }, new PypiLinkProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: "json", pattern: '**/composer.json' }, new ComposerLinkProvider()));
	context.subscriptions.push(vscode.languages.registerDocumentLinkProvider({ language: "yaml", pattern: '**/pubspec.yaml' }, new PubSpecLinkProvider()));
}

export function deactivate() { }

