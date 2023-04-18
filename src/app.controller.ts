import { Body, Controller, Get, HttpException, HttpStatus, Logger, ParseArrayPipe, Post, Query, Render } from '@nestjs/common';
import { AnswerDto } from './answer.dto';
import { GoogleSheetsService } from './google-sheets.service';

@Controller()
export class AppController {
  private readonly logger = new Logger('App');

  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Get()
  @Render('index')
  root(@Query('invitations') invitations?: string) {
    if (!invitations) {
      return { invitations: 'Дорогие гости', hasInvitations: false };
    }

    const ids = invitations.split(',').map(i => +i);
    const res = this.googleSheetsService.getUsersByIds(ids);
    invitations = res.invitations.join(' и ');
    if (process.env.NODE_ENV === 'prod') {
      this.googleSheetsService.updateViews(ids);
    }
    return { invitations, hasInvitations: true, answer: res.answer };
  }

  @Post('api/answer')
  async updateAnswer(
    @Query('invitations', new ParseArrayPipe({ items: Number, separator: ',' })) invited: number[],
    @Body() answerDto: AnswerDto
  ) {
    try {
      return await this.googleSheetsService.setAnswer(invited, answerDto);
    } catch (error) {
      this.logger.error(error);
      throw new HttpException('Что-то пошло не так...', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
