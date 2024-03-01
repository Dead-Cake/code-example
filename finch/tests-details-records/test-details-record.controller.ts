import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOkResponse, ApiCreatedResponse, ApiOperation } from '@nestjs/swagger';

import { TestDetailsRecordService } from './test-details-record.service';
import { BaseMessageDto, BaseQueryDto, BaseController } from '../common';
import { AuthGuard } from '../auth/common/decorators';
import { CreateTestDetailsRecordDto, TestDetailsRecordResponseDto, UpdateTestDetailsRecordDto } from './DTO';
import { Permissions } from '../common/decorators';
import { Permission as PermissionsEnum } from '../common/enums/permissions';
import { Context, GenericContext } from '../context';
import { BaseTestIdDto } from '../common/DTOs';

@Controller('test-details-record')
@ApiTags('Test details record')
@AuthGuard()
@ApiBearerAuth()
export class TestDetailsRecordController extends BaseController {
  constructor (private readonly testDetailsService: TestDetailsRecordService) {
    super();
  }

  @ApiOperation({ deprecated: true, })
  @ApiCreatedResponse({ description: 'Test Details record was successfully created', type: TestDetailsRecordResponseDto, })
  @Post()
  @Permissions(PermissionsEnum.GENTEST_EDIT)
  create (@Context() context: GenericContext, @Body() testDetails: CreateTestDetailsRecordDto): Promise<TestDetailsRecordResponseDto> {
    return this.testDetailsService.create(context, testDetails);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Returns list of __tests__ details', type: [ TestDetailsRecordResponseDto, ], })
  @Get('all')
  @Permissions(PermissionsEnum.GENTEST_READ)
  readAll (@Context() context: GenericContext, @Query() query: BaseTestIdDto): Promise<Array<TestDetailsRecordResponseDto>> {
    return this.testDetailsService.readAll(context, query.testId);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Test Details record was successfully updated', type: TestDetailsRecordResponseDto, })
  @Put()
  @Permissions(PermissionsEnum.GENTEST_EDIT)
  update (@Context() context: GenericContext, @Query() query: BaseQueryDto, @Body() testDetails: UpdateTestDetailsRecordDto): Promise<TestDetailsRecordResponseDto> {
    return this.testDetailsService.update(context, query.id, testDetails);
  }

  @ApiOperation({ deprecated: true, })
  @ApiOkResponse({ description: 'Test Details record was successfully deleted', type: BaseMessageDto, })
  @Delete()
  @Permissions(PermissionsEnum.GENTEST_DELETE)
  delete (@Context() context: GenericContext, @Query() query: BaseQueryDto): Promise<BaseMessageDto> {
    return this.testDetailsService.delete(context, query.id);
  }
}
