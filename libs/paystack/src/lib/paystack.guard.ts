import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
// import { PAYSTACK_SECRET_KEY } from './paystack.config';
import { createHmac } from 'crypto';
import { PaystackService } from './paystack.service';


@Injectable()
export class PaystackGuard implements CanActivate {
  constructor(private paystackSrv: PaystackService) {
    // console.log('show mw how to do this', webho.config);
  }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    // console.log(
    //   'did request actually come through ===>',
    //   request.headers?.['x-paystack-signature'] ||
    //     `${request.headers?.['name']} just caught trying to hack QPLUS` ||
    //     'No paystack signature defined',
    // );
    const hash = createHmac('sha512', this.paystackSrv.config?.secretkey)
      .update(JSON.stringify(request.body))
      .digest('hex');

    if (hash !== request.headers?.['x-paystack-signature']) {
      throw new ForbiddenException('Paystack Signature has failed');
    }

    return true;
  }
}
