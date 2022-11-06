import * as vscode from 'vscode';
import LinkProvider from './LinkProvider.interface';

export class ComposerLinkProvider implements vscode.DocumentLinkProvider, LinkProvider {
    registryRootUrl = "https://packagist.org/packages";

	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
		const detectedLinks: vscode.DocumentLink[] = [];

		try {
			const text = document.getText();
			const parsedJson = JSON.parse(text);
			const allDependencies = Object.keys(parsedJson.require);

			for (let dependencyName of allDependencies) {
				var regex = new RegExp('"' + dependencyName + '"', 'gi'), result, indices = [];

				while ((result = regex.exec(text))) {
					indices.push(result.index);
				}

				for (let index of indices) {
					detectedLinks.push(
						{
							range: new vscode.Range(document.positionAt(index), document.positionAt(index + dependencyName.length + 2)),
							target: vscode.Uri.parse(`${this.registryRootUrl}/${dependencyName}`),
							tooltip: `${this.registryRootUrl}/${dependencyName}`,
						}
					)
				}

			}

			return detectedLinks;
		} catch (e) {
			console.log("Cannot parse file", document.fileName)
			return [];
		}
	}

	resolveDocumentLink?(link: vscode.DocumentLink, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink> {
		return link;
	}
}


