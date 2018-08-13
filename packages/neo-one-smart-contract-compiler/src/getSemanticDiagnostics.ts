import { tsUtils } from '@neo-one/ts-utils';
import ts from 'typescript';
import { compileForDiagnostics } from './compile';
import { createContextForLanguageService } from './createContext';

export const getSemanticDiagnostics = ({
  filePath,
  smartContractDir,
  languageService,
}: {
  readonly filePath: string;
  readonly smartContractDir: string;
  readonly languageService: ts.LanguageService;
}): ReadonlyArray<ts.Diagnostic> => {
  const context = createContextForLanguageService(languageService, smartContractDir);
  try {
    compileForDiagnostics({
      sourceFile: tsUtils.file.getSourceFileOrThrow(context.program, filePath),
      context,
      sourceMaps: {},
    });
  } catch {
    // do nothing, should never happen
  }

  return context.diagnostics;
};
