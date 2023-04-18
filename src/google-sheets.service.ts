import { Injectable, Logger } from '@nestjs/common';
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import * as creds from '../client_secret.json';
import { AnswerDto } from './answer.dto';

@Injectable()
export class GoogleSheetsService {
  private doc: GoogleSpreadsheet;
  private sheetId = '1mVLNduuKlWfjtvVY_EHJrYQ-T8ETpS4NdQMDdburuso';
  private sheetIndex = 0;
  private data: GoogleSpreadsheetRow[];
  private link = 'http://wedding-invitations-2023.ru/?invitations=';
  private rowLinkIndex = 4;
  private readonly logger = new Logger('Google');

  get sheet(): GoogleSpreadsheetWorksheet {
    return this.doc.sheetsByIndex[this.sheetIndex];
  }

  constructor() {
    this.init();
  }

  async refreshRowData() {
    await this.doc.loadInfo();
    this.data = await this.sheet.getRows();
  }  

  async init(): Promise<void> {
    this.doc = new GoogleSpreadsheet(this.sheetId);
    await this.doc.useServiceAccountAuth(creds);
    await this.refreshRowData();
  }

  getUsersByIds(ids: number[]) {
    let answer: string;
    const invitations = ids.map(id => {
      const invited = this.data[id - 2];
      if (!answer) {
        answer = invited.status;
      }
      return invited.alias;
    });

    return {
      answer,
      invitations,
    }
  }

  async setAnswer(ids: number[], answerDto: AnswerDto) {
    ids.forEach(id => {
      const invited = this.data[id - 2];
      invited.status  = answerDto.answer ? 'Yes' : 'No';
      invited.save();
    });
  }

  async updateViews(ids: number[]) {
    try {
      await this.refreshRowData();
      ids.forEach(id => {
        const invited = this.data[id - 2];
        invited.viewCount++;
        invited.save();
      });
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async updateLinksForUsers() {
    await this.sheet.loadCells();
    this.data.forEach(el => {
      el.link = this.link + el.rowIndex;
      this.sheet.getCell(el.rowIndex - 1, this.rowLinkIndex).value = el.link;
    });

    this.sheet.saveUpdatedCells();
  }
}
