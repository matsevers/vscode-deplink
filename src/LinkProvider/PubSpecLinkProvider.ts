import * as vscode from 'vscode';
import LinkProvider from './LinkProvider.interface';

export class PubSpecLinkProvider implements vscode.DocumentLinkProvider, LinkProvider {
    registryRootUrl = "https://pub.dev/packages";

    #yaml = require('yaml');

    provideDocumentLinks(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink[]> {
        const detectedLinks: vscode.DocumentLink[] = [];

        try {
            const text = document.getText();
            const parsedYaml = this.#yaml.parse(text);
            const allDependencies = Array.from(new Set(Object.keys(parsedYaml.dependencies).concat(Object.keys(parsedYaml.dev_dependencies)))) as string[];

            for (let dependencyName of allDependencies) {
                var regex = new RegExp(dependencyName, 'gi'), result, indices = [];

                while ((result = regex.exec(text))) {
                    indices.push(result.index);
                }

                for (let index of indices) {
                    detectedLinks.push(
                        {
                            range: new vscode.Range(document.positionAt(index), document.positionAt(index + dependencyName.length)),
                            target: vscode.Uri.parse(`${this.registryRootUrl}/${dependencyName}`),
                            tooltip: `${this.registryRootUrl}/${dependencyName}`,
                        }
                    )
                }

            }

            return detectedLinks;
        } catch (e) {
            console.log("Cannot parse file", document.fileName, e)
            return [];
        }
    }

    resolveDocumentLink?(link: vscode.DocumentLink, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentLink> {
        return link;
    }
}