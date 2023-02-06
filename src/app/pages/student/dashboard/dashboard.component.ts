import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DomSanitizer} from "@angular/platform-browser";
import {AngularEditorConfig} from "@kolkov/angular-editor";
import {IDocument} from "@lib/interfaces/idocument";
import {DocumentService} from "@lib/services/document/document.service";
import {PaginationParams} from "@lib/classes/pagination-params";
import {IPaginatedMetadata} from "@lib/interfaces/ipaginated-metadata";
import {DocumentState} from "@lib/enums/document-state";
import {Notify} from "notiflix/build/notiflix-notify-aio";
import {Confirm} from "notiflix";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  limits: number[] = [10, 20, 40, 50]
  docForm!: FormGroup;
  description: Event = null!;
  showDialog = false;
  documents: Array<IDocument> = [];
  isLoading = false;
  formMode: 'new' | 'edit' | 'resolve' = 'new'
  states = DocumentState;

  pagination = new PaginationParams()
  paginationMeta: IPaginatedMetadata = {
    "page": 1,
    "take": 10,
    "itemCount": 10,
    "pageCount": 1,
    "hasPreviousPage": false,
    "hasNextPage": false
  };
  maxPages = 10;
  pages: number[] = [];
  doc: IDocument = null!;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '0',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    placeholder: 'Enter text here...',
    defaultParagraphSeparator: '',
    defaultFontName: '',
    defaultFontSize: '',
    fonts: [
      {class: 'arial', name: 'Arial'},
      {class: 'times-new-roman', name: 'Times New Roman'},
      {class: 'calibri', name: 'Calibri'},
      {class: 'comic-sans-ms', name: 'Comic Sans MS'}
    ],
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadWithCredentials: false,
    sanitize: true,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };


  constructor(private domSanitizer: DomSanitizer, private fb: FormBuilder, private _docService: DocumentService) {
  }

  showConfirm() {
    this.showDialog = true;
  }

  ngOnInit() {
    this.docForm = this.fb.group({
      title: [null, [Validators.required]],
      description: [null, [Validators.required]]
    })

    this.getDocs()
  }

  editDocument(doc: IDocument) {
    this.formMode = 'edit';
    this.doc = doc;
    this.docForm.controls['title'].setValue(doc.title);
    this.docForm.controls['description'].setValue(doc.description);
    this.showDialog = true;
  }

  publishDocument(doc: IDocument) {
    Confirm.show(
      'Confirmation',
      'Are you sure you want to publish this document? You cannot modify this document afterwards.',
      'Yes',
      'No',
      () => {
        this.isLoading = true;
        this.doc = doc;
        this._docService.publishDocument(doc.id, {staffId: ''})
          .subscribe((response: IDocument) => {
            if (response) {
              Notify.success(`Published ${response.title}`)
            } else {
              Notify.failure('An error occurred')
            }
          }, (error) => {
            Notify.failure(error?.error?.message || error?.error?.error  || 'An error occurred')
          }, () => {
            this.isLoading = false;
            this.getDocs()
            this.doc = null!;
          })
      },
      () => {
        Notify.info('If you say so...');
      },
      {
        width: '320px',
        borderRadius: '8px',
      },
    )
  }

  sendNudge(doc: IDocument) {
    Confirm.show(
      'Confirmation',
      'Are you sure you want to nudge the current handler?',
      'Yes',
      'No',
      () => {
        this.isLoading = true;
        this.doc = doc;
        this._docService.sendNudge(doc.id)
          .subscribe((response) => {
            if (response) {
              Notify.success(`Sent a nudge`)
            } else {
              Notify.failure('An error occurred')
            }
          }, (error) => {
            Notify.failure(error?.error?.message || error?.error?.error  || 'An error occurred')
          }, () => {
            this.isLoading = false;
            this.getDocs()
            this.doc = null!;
          })
      },
      () => {
        Notify.info('If you say so...');
      },
      {
        width: '320px',
        borderRadius: '8px',
      },
    )
  }

  saveDocument() {
    if (this.docForm.valid) {
      if (this.formMode === 'edit') {
        this._docService.updateDocument(this.doc.id, {...this.docForm.value})
          .subscribe(
            (response) => {
              if (response) {
                this.getDocs()
                this.showDialog = false;
                Notify.success('Updated Successfully')
              } else {
                Notify.failure("An error occurred, please try again")
              }
            },
            (error) => {
              console.error(error)
              Notify.failure(`${error.error?.error || 'An error occurred'}`);
            },
            () => {
              this.isLoading = false;
              this.paginate();
              this.docForm.reset();
              this.doc = null!;
              this.formMode = 'new'
            }
          );
      }
      else if (this.formMode === 'resolve') {
        this._docService.resolveDocument(this.doc.id, {...this.docForm.value})
          .subscribe(
            (response) => {
              if (response) {
                this.getDocs()
                this.showDialog = false;
                Notify.success('Updated Successfully')
              } else {
                Notify.failure("An error occurred, please try again")
              }
            },
            (error) => {
              console.error(error)
              Notify.failure(`${error.error?.error || 'An error occurred'}`);
            },
            () => {
              this.isLoading = false;
              this.paginate();
              this.docForm.reset();
              this.doc = null!;
              this.formMode = 'new'
            }
          );
      }else {
        this._docService.createDocument(this.docForm.value)
          .subscribe(
            (response) => {
              if (response) {
                this.getDocs()
                Notify.success('Created Successfully')
                this.showDialog = false;
              } else {
                Notify.failure("An error occurred, please try again")
              }
            },
            (error) => {
              console.error(error)
              Notify.failure(`${error.error?.error || 'An error occurred'}`);
            },
            () => {
              this.isLoading = false;
              this.paginate();
              this.docForm.reset();
            }
          );
      }
    } else {
      Object.values(this.docForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

  getDocs() {
    this.isLoading = true;
    this._docService.retrieveDocuments(this.pagination)
      .subscribe(
        (response) => {
          if (response) {
            this.documents = response.data;
            this.paginationMeta = response.meta;
          } else {
            Notify.failure("An error occurred, please try again")
          }
        },
        (error) => {
          console.error(error)
          Notify.failure(`${error.error?.error || 'An error occurred'}`);
        },
        () => {
          this.isLoading = false;
          this.paginate();
        }
      );
  }

  deleteDoc(doc: IDocument) {
    Confirm.show(
      'Confirmation',
      'Are you sure you want to delete this document? This action is irreversible.',
      'Yes',
      'No',
      () => {
        this.isLoading = true;
        this.doc = doc;
        this._docService.deleteSingleDocument(doc.id)
          .subscribe((response: IDocument) => {
            if (response) {
              Notify.success(`Deleted ${response.title}`)
            } else {
              Notify.failure('An error occurred')
            }
          }, (error) => {
            Notify.failure(error?.error?.message || error?.error?.error  || 'An error occurred')
          }, () => {
            this.isLoading = false;
            this.getDocs()
            this.doc = null!;
          })
      },
      () => {
        Notify.info('If you say so...');
      },
      {
        width: '320px',
        borderRadius: '8px',
      },
    )

  }

  cancel() {
    this.showDialog = false;
  }

  setPage(page: number) {
    this.pagination.page = page;
    this.getDocs()
  }

  previousPage() {
    if (this.pagination.page > 1) {
      --this.pagination.page;
      this.getDocs()
    }
  }

  nextPage() {
    if (this.pagination.page < this.paginationMeta.pageCount) {
      ++this.pagination.page;
      this.getDocs()
    }
  }

  paginate() {
    if (this.pagination.page < 1) {
      this.pagination.page = 1;
    } else if (this.pagination.page > this.paginationMeta.pageCount) {
      this.pagination.page = this.paginationMeta.pageCount;
    }

    let startPage: number, endPage: number;
    if (this.paginationMeta.pageCount <= this.maxPages) {
      startPage = 1;
      endPage = this.paginationMeta.pageCount;
    } else {
      const maxPagesBeforeCurrentPage = Math.floor(this.maxPages / 2);
      const maxPagesAfterCurrentPage = Math.ceil(this.maxPages / 2) - 1;
      if (this.pagination.page <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = this.maxPages;
      } else if (this.pagination.page + maxPagesAfterCurrentPage >= this.paginationMeta.pageCount) {
        startPage = this.paginationMeta.pageCount - this.maxPages + 1;
        endPage = this.paginationMeta.pageCount;
      } else {
        startPage = this.pagination.page - maxPagesBeforeCurrentPage;
        endPage = this.pagination.page + maxPagesAfterCurrentPage;
      }
    }

    // const startIndex = (this.pagination.page - 1) * this.pagination.take;
    // const endIndex = Math.min(startIndex + this.pagination.take - 1, this.paginationMeta.pageCount - 1);

    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );

    this.pages = pages;
  }

  pillColor(state: DocumentState) {
    switch (state) {
      case DocumentState.APPROVED:
        return 'bg-green-500'
        break;
      case DocumentState.DRAFT:
        return 'bg-gray-500'
        break;
      case DocumentState.PENDING:
        return 'bg-orange-500'
        break;
      case DocumentState.REJECTED:
        return 'bg-red-500'
        break;
      default:
        return 'bg-black'
    }
  }

  resolveDocument(doc: IDocument) {
    this.formMode = 'resolve';
    this.doc = doc;
    this.docForm.controls['title'].setValue(doc.title);
    this.docForm.controls['description'].setValue(doc.description);
    this.showDialog = true;
  }
}
