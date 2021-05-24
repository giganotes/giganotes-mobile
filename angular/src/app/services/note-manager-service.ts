import { Injectable } from '@angular/core';
import { Note } from '../model/note';
import { Folder } from '../model/folder';
import { EmptyResultResponse, GetFolderByIdResponse, CreateFolderResponse, CreateNoteResponse, GetFoldersListResponse, GetRootFolderResponse, NoteShortInfo, GetNotesListResponse, GetNoteByIdResponse } from './../../proto/messages_pb';
import {InteropService} from './interop.service';

@Injectable()
export class NoteManagerService {

    constructor(private interopService: InteropService) {
    }

    async createFolder(title: string, parentId: string): Promise<string> {
      return this.interopService.createFolder(title, parentId);
    }

    async createNote(title: string, text: string, folderId: string): Promise<string> {
      return this.interopService.createNote(title, text, folderId);
    }

    async updateNote(note: Note): Promise<void> {
      return this.interopService.updateNote(note);
    }

    async updateFolder(folder: Folder): Promise<void> {
      return this.interopService.updateFolder(folder);
    }

    async loadNoteById(id: string): Promise<Note> {
      return this.interopService.loadNoteById(id);
    }

    async removeNote(id: string): Promise<void> {
      return this.interopService.removeNote(id);
    }

    async removeFolder(id: string): Promise<void> {
      return this.interopService.removeFolder(id);
    }

    async getRootFolder(): Promise<Folder> {
      return this.interopService.getRootFolder();
    }

    async loadFolderById(id: string): Promise<Folder> {
      return this.interopService.loadFolderById(id);
    }

    async loadNotesByFolder(folderId: string): Promise<Note[]> {
      return this.interopService.loadNotesByFolder(folderId);
    }

    async getAllNotes(offset, limit : number): Promise<Note[]> {
      return this.interopService.getAllNotes(offset, limit);
    }

    async getAllFolders(): Promise<Folder[]> {
      return this.interopService.getAllFolders();
    }

    async searchNotes(query: string, folderId: string): Promise<Note[]> {
      return this.interopService.searchNotes(query, folderId);
   }

    async getFavoriteNotes(): Promise<Note[]> {
    /*  const parent = this;
      const promise = new Promise<Note[]>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-getfavorites-reply', (event, arg) => {
          var props = GetNotesListResponse.deserializeBinary(arg).toObject() as GetNotesListResponse.AsObject;
          var notes = props.notesList.map((n: NoteShortInfo.AsObject) => {
              const note : Note = {
                id: n.id,
                title: n.title,
                text: "",
                folderId: n.folderid,
                level: 0,
                createdAt: new Date(n.createdat),
                updatedAt: new Date(n.updatedat),
                userId: 0,
                deletedAt: null
              };
              return note;
          });
          resolve(notes);
        });
      });

      ipcRenderer.send('note-manager-service-getfavorites-request', null);
      return promise;*/
      return null;
    }

    async addToFavorites(noteId: string): Promise<void> {
     /* const promise = new Promise<void>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-addtofavorites-reply', (event, arg) => {
            resolve();
        });
      });

      ipcRenderer.send('note-manager-service-addtofavorites-request', {id : noteId});
      return promise;*/
      return null;
    }

    async removeFromFavorites(noteId: string): Promise<void> {
      /*const promise = new Promise<void>(function (resolve, reject) {
        ipcRenderer.once('note-manager-service-removefromfavorites-reply', (event, arg) => {
            resolve();
        });
      });

      ipcRenderer.send('note-manager-service-removefromfavorites-request', {id : noteId});
      return promise;*/
      return null;
    }
}
