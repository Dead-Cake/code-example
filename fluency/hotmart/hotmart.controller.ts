import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { BaseMessageDTO } from '../common/base';
import { HotmartWebhookRequestDTO } from './DTO';
import { HotmartService } from './hotmart.service';
import { AuthGuard } from '../common/decorators';
import { AuthStrategyEnum } from '../common/enums';

@Controller('hotmart')
@ApiTags('Hotmart')
export class HotmartController {
  constructor(private readonly hotmartService: HotmartService) {}

  @ApiOkResponse({ description: 'Returns status of webhook processing', type: BaseMessageDTO, })
  @AuthGuard(AuthStrategyEnum.HOTTOK)
  @ApiBody({ type: HotmartWebhookRequestDTO, })
  @Post('webhook/request-event')
  webhookRequestEvent(@Body() body: HotmartWebhookRequestDTO): Promise<BaseMessageDTO> {
    return this.hotmartService.webhookRequestEvent(body);
  }
}
