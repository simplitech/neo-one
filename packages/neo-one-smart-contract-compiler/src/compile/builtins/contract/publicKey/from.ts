import ts from 'typescript';
import { DiagnosticCode } from '../../../../DiagnosticCode';
import { DiagnosticMessage } from '../../../../DiagnosticMessage';
import { ScriptBuilder } from '../../../sb';
import { VisitOptions } from '../../../types';
import { BuiltinMemberCall } from '../../BuiltinMemberCall';
import { MemberLikeExpression } from '../../types';

// tslint:disable-next-line export-name
export class PublicKeyFrom extends BuiltinMemberCall {
  public emitCall(
    sb: ScriptBuilder,
    _func: MemberLikeExpression,
    node: ts.CallExpression,
    options: VisitOptions,
  ): void {
    const address = sb.context.analysis.extractLiteralPublicKey(node);
    if (address === undefined) {
      sb.context.reportError(node, DiagnosticCode.InvalidLiteral, DiagnosticMessage.InvalidPublicKey);

      return;
    }

    // [buffer]
    sb.emitPushBuffer(node, address);
    // [val]
    sb.emitHelper(node, options, sb.helpers.wrapBuffer);
  }
}
