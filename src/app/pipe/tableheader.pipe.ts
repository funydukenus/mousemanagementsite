import { Injectable, Pipe, PipeTransform } from '@angular/core';

interface columnDisplay{
   key: string,
   display: string
}

@Pipe({ name: 'tableheaderconverter' })

export class TableHeaderConverter implements PipeTransform {
   // columns of the table
   displayedColumns: columnDisplay[] = [
      {
         key: 'handler',
         display: 'Handled By'
      },
      {
         key: 'mouseLine',
         display: 'MouseLine'
      },
      {
         key: 'gender',
         display: 'Gender'
      },
      {
         key: 'genoType',
         display: 'GenoType'
      },
      {
         key: 'birthDate',
         display: 'BirthDate'
      },
      {
         key: 'endDate',
         display: 'EndDate'
      },
      {
         key: 'confirmationOfGenoType',
         display: 'COG'
      },
      {
         key: 'phenoType',
         display: 'PhenoType'
      },
      {
         key: 'projectTitle',
         display: 'ProjectTitle'
      },
      {
         key: 'experiment',
         display: 'Experiment'
      },
      {
         key: 'comment',
         display: 'Comment'
      }
   ]

   /*
   Function name: transform
   Description: A pipe transformation used in the harvestMouseTable
                to convert each of header to respective display column header
   */
   transform(text: string[]): columnDisplay[]{
      return this.displayedColumns;
   }
} 