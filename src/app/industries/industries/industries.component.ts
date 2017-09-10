import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MD_DIALOG_DATA } from '@angular/material';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as Firebase from 'Firebase/app';
import { Subject } from '@angular/Common'

import { NewIndustryComponent } from '../new-industry/new-industry.component';
import { MdSnackBar } from '@angular/material';
import { ErrorDialogComponent } from '../../shared/error-dialog/error-dialog.component';

@Component({
  selector: 'app-industries',
  templateUrl: './industries.component.html',
  styleUrls: ['./industries.component.css']
})
export class IndustriesComponent implements OnInit {

  form: FormGroup;
  industries$: FirebaseListObservable<any>;

  constructor(
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    private _fb: FormBuilder,
    private _afDb: AngularFireDatabase    
  ) {
    this.buildForm();
    this.industries$ = this._afDb.list(`industries`);
    this.buildForm();
    this.industries$ = this._afDb.list(`industries`, {
      query: {
        equalTo: this.sortSubject
      }
    });
    this.sortSubject = new Subject();
  }

  // this is a lifecycle function, it runs when the component has been initialized.
  ngOnInit() {
  }


  // when the user clicks 'Add Industry' this function runs.
  addIndustryDialog(): void {
    let dialogRef = this.dialog.open(NewIndustryComponent, {
      height: '200px',
      width: '300px'
    });
    // we subscribe to dialogs close event.
    dialogRef.afterClosed().subscribe( result => {
      // console.log('result from the dialog is: ' + result);
      if (result) {
        // there is a result to process, lets now write it to the database.
        this.writeToDataBase(result).then( snapshot => {
        // the database write was successful
        let snackBarRef = this.snackBar.open( 'Industry added to database', 'Okay', { 
          duration: 2000,
         });
        }, error => {
          // open a new dialog showing the error
          let dialogRef = this.dialog.open(ErrorDialogComponent, {
            height: '200px',
            width: '300px',
            data:  error
          });
        });
      } else {
        // result was false, do nothing.
        return;
      }
    });
  }

  // the new industry is written to the data with below components
  writeToDataBase(IndustryName:string): Firebase.Promise<any> {
    return this._afDb.list(`industries`).push({
    name: IndustryName,
  })
  }
  
  // the user clicks a specific industry
  // TODO: navigate to the IndustryComponent with the selected industryId
  showListKey(industryID:string){
    console.log(industryID);
  }

  // DON'T worry about me just yet.
  // we build the form in a separate function, this helps keep the constructor clean.
  buildForm() {
    this.form = this._fb.group({
      searchInput: []
    });
  }

}


