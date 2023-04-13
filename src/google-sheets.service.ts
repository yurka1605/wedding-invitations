import { Injectable } from '@nestjs/common';
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import * as creds from '../client_secret.json';
import { AnswerDto } from './answer.dto';

@Injectable()
export class GoogleSheetsService {
  private doc: GoogleSpreadsheet;
  private sheetId = '1mVLNduuKlWfjtvVY_EHJrYQ-T8ETpS4NdQMDdburuso';
  private sheetIndex = 0;
  private data: GoogleSpreadsheetRow[];
  private link = 'https://wedding-invitation-phi-blush.vercel.app/?invitations=';
  private rowLinkIndex = 4;

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
    
    // uncommented if need update links
    // this.updateLinksForUsers();
  }

  async getUsersByIds(ids: number[]) {
    await this.refreshRowData();
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

  
  async updateViews(ids: number[]) {
    await this.refreshRowData();
    ids.forEach(id => {
      const invited = this.data[id - 2];
      invited.viewCount++;
      invited.save();
    });
  }

  async setAnswer(ids: number[], answerDto: AnswerDto) {
    await this.refreshRowData();
    ids.forEach(id => {
      const invited = this.data[id - 2];
      invited.status  = answerDto.answer ? 'Yes' : 'No';
      invited.save();
    });
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
