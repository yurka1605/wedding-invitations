import { Injectable } from '@nestjs/common';
import { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet';
import * as creds from '../client_secret.json';
import { AnswerDto } from './answer.dto';

@Injectable()
export class GoogleSheetsService {

  private doc: GoogleSpreadsheet;
  private sheetId = '1mVLNduuKlWfjtvVY_EHJrYQ-T8ETpS4NdQMDdburuso';
  private data: GoogleSpreadsheetRow[];

  constructor() {
    this.init();
  }

  async refreshRowData() {
    await this.doc.loadInfo();
    this.data = await this.doc.sheetsByIndex[0].getRows();
  }  

  async init(): Promise<void> {
    this.doc = new GoogleSpreadsheet(this.sheetId);
    await this.doc.useServiceAccountAuth(creds);
    await this.refreshRowData();
  }

  async getUsersNamesByIds(ids: number[]) {
    await this.refreshRowData();
    return ids.map(id => {
      const invited = this.data[id - 1];
      return invited.alias;
    });
  }

  
  async updateViews(ids: number[]) {
    await this.refreshRowData();
    ids.forEach(id => {
      const invited = this.data[id - 1];
      invited.viewCount++;
      invited.save();
    });
  }

  async setAnswer(ids: number[], answerDto: AnswerDto) {
    await this.refreshRowData();
    ids.forEach(id => {
      const invited = this.data[id - 1];
      invited.status  = answerDto.answer ? 'Yes' : 'No';
      invited.save();
    });
  }
}
