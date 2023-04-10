import { Body, Controller, Get, ParseArrayPipe, Post, Query, Render } from '@nestjs/common';
import { AnswerDto } from './answer.dto';
import { GoogleSheetsService } from './google-sheets.service';

@Controller()
export class AppController {
  constructor(private readonly googleSheetsService: GoogleSheetsService) {}

  @Get()
  @Render('index')
  default() {
    return { invitations: 'Дорогие гости' }
  }

  @Get()
  @Render('index')
  async root(
    @Query(
      'invited',
      new ParseArrayPipe({ items: Number, separator: ',' })
    ) ids: number[]
  ) {
    try {
      const invitations: string = (await this.googleSheetsService.getUsersNamesByIds(ids)).join(' и ');
      if (process.env.NODE_ENV === 'prod') {
        await this.googleSheetsService.updateViews(ids);
      }
      return { invitations };
    } catch (error) {
      return error;
    }
  }

  @Post('api/answer')
  async updateAnswer(
    @Query('invited', new ParseArrayPipe({ items: Number, separator: ',' })) invited: number[],
    @Body() answerDto: AnswerDto
  ) {
    try {
      return await this.googleSheetsService.setAnswer(invited, answerDto);
    } catch (error) {
      return error;
    }
  }
}
