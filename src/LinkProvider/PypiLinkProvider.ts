import * as vscode from 'vscode';
import LinkProvider from './LinkProvider.interface';

export class PypiLinkProvider implements vscode.DocumentLinkProvider, LinkProvider {
	registryRootUrl = "https://pypi.org/project";

	provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
		const detectedLinks: vscode.DocumentLink[] = [];

		try {
			const text = document.getText();
			const lines = text.split(/\r?\n/);
			const allDependencies = lines.map(line => (line.match(/^[a-z0-9\s]+/) || [])[0]);

			for (let dependencyName of allDependencies) {
				var regex = new RegExp(dependencyName, 'gi'), result, indices = [];

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
			return [];
		}
	}

	resolveDocumentLink?(link: vscode.DocumentLink, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink> {
		return link;
	}
}
