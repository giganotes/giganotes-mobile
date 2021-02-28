import { Injectable } from '@angular/core';
import {LastLoginData} from '../model/last-login-data';
import { base64 } from "rfc4648";
import {
  GetLastLoginDataResponse,
  LoginResponse,
  Login,
  LoginSocial,
  GetAllNotes,
  GetNotesListResponse,
  NoteShortInfo,
  GetRootFolderResponse,
  GetFoldersListResponse,
  GetFolderById,
  GetFolderByIdResponse,
  GetNotesList,
  GetNoteById,
  GetNoteByIdResponse,
  SearchNotes,
  CreateNote, CreateNoteResponse, CreateFolder, CreateFolderResponse, UpdateNote, UpdateFolder
} from '../../proto/messages_pb';
import {AuthResponse} from '../model/server-responses-models/auth-response';
import {Note} from '../model/note';
import {Folder} from '../model/folder';
declare const Android;

@Injectable({
  providedIn: 'root'
})
export class InteropService {

  constructor() { }

  runCommand(javaFuncName: string, params: object): Promise<any> {
    const rand = 'asyncJava_' + Math.floor(Math.random() * 1000000);
    window[rand] = {};

    // func called from android
    window[rand].callback = (isSuccess) => {
      const dataOrErr = Android.runAsyncResult(rand);
      if (isSuccess) { window[rand].resolve(dataOrErr); }
      else { window[rand].reject(dataOrErr); }
      delete window[rand];
    };

    Android.runAsync(rand, javaFuncName, JSON.stringify(params));

    return new Promise((resolve, reject) => {
      window[rand].resolve = (data) => resolve(data);
      window[rand].reject = (err) => reject(err);
    });
  }

  initCore(): Promise<any> {
    console.log('InitCore');
    return this.runCommand('runCoreCommand', {command : 1});
  }

  async getLastLoginData(): Promise<LastLoginData> {
    const result = await this.runCommand('runCoreCommand', {command : 9});
    const buffer = base64.parse(result, { loose : true});
    const resp = GetLastLoginDataResponse.deserializeBinary(buffer).toObject() as GetLastLoginDataResponse.AsObject;
    return {
      token : resp.token,
      email : resp.email,
      userId : resp.userid,
      isTokenValid : resp.istokenvalid,
    } as LastLoginData;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const loginCommand = new Login();
    loginCommand.setEmail(email);
    loginCommand.setPassword(password);
    const commandData = base64.stringify(loginCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 8, data: commandData});
    const buffer = base64.parse(result);
    const loginResponse = LoginResponse.deserializeBinary(buffer).toObject();
    return {
      success: loginResponse.success,
      errorCode: loginResponse.errorcode,
    } as AuthResponse;
  }

  async loginSocial(email: string, provider: string, token: string): Promise<AuthResponse> {
    const loginCommand = new LoginSocial();
    loginCommand.setEmail(email);
    loginCommand.setProvider(provider);
    loginCommand.setToken(token);
    const commandData = base64.stringify(loginCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 24, data: commandData});
    const buffer = base64.parse(result);
    const loginResponse = LoginResponse.deserializeBinary(buffer).toObject();
    return {
      success: loginResponse.success,
      errorCode: loginResponse.errorcode,
    } as AuthResponse;
  }

  async logout(): Promise<void> {
    await this.runCommand('runCoreCommand', {command : 23});
  }

  async register(email: string, password: string): Promise<AuthResponse> {
    const loginCommand = new Login();
    loginCommand.setEmail(email);
    loginCommand.setPassword(password);
    const commandData = base64.stringify(loginCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 19, data: commandData});
    const buffer = base64.parse(result);
    const loginResponse = LoginResponse.deserializeBinary(buffer).toObject();
    return {
      success: loginResponse.success,
      errorCode: loginResponse.errorcode,
    } as AuthResponse;
  }

  async getAllNotes(offset, limit: number): Promise<Note[]> {
    console.log('GetAllNotes()');
    const getAllNotesCommand = new GetAllNotes();
    getAllNotesCommand.setOffset(offset);
    getAllNotesCommand.setLimit(limit);
    const commandData = base64.stringify(getAllNotesCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 12, data: commandData});
    const buffer = base64.parse(result);
    const props = GetNotesListResponse.deserializeBinary(buffer).toObject() as GetNotesListResponse.AsObject;
    const notes = props.notesList.map((n: NoteShortInfo.AsObject) => {
      const note: Note = {
        id: n.id,
        title: n.title,
        text: '',
        folderId: n.folderid,
        level: 0,
        createdAt: new Date(n.createdat),
        updatedAt: new Date(n.updatedat),
        userId: 0,
        deletedAt: null
      };
      return note;
    });
    return notes;
  }

  async getRootFolder(): Promise<Folder> {
    const result = await this.runCommand('runCoreCommand', {command : 10});
    const buffer = base64.parse(result, { loose : true});
    const folderProps = GetRootFolderResponse.deserializeBinary(buffer).toObject() as GetRootFolderResponse.AsObject;
    const folder: Folder = {
      id : folderProps.folderid,
      title: folderProps.title,
      parentId: null,
      children: null,
      notes: null,
      level: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: new Date(),
    };
    return folder;
  }

  async getAllFolders(): Promise<Folder[]> {
    const result = await this.runCommand('runCoreCommand', {command : 11});
    const buffer = base64.parse(result, { loose : true});
    const props = GetFoldersListResponse.deserializeBinary(buffer).toObject() as GetFoldersListResponse.AsObject;
    const folders = props.foldersList.map(f => {
      const folder: Folder = {
        id : f.id,
        title: f.title,
        parentId: f.parentid,
        children: null,
        notes: null,
        level: f.level,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };
      return folder;
    });
    return folders;
  }

  async loadFolderById(id: string): Promise<Folder> {
    console.log('Get folder by id' + id);
    const getFolderCommand = new GetFolderById();
    getFolderCommand.setFolderid(id);
    const commandData = base64.stringify(getFolderCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 6, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const folderProps = GetFolderByIdResponse.deserializeBinary(buffer).toObject() as GetFolderByIdResponse.AsObject;
    const folder: Folder = {
      id : folderProps.id,
      title: folderProps.title,
      level: folderProps.level,
      parentId : folderProps.parentid,
      children : [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt : null
    };
    return folder;
  }

  async loadNotesByFolder(folderId: string): Promise<Note[]> {
    const getNodesListCommand = new GetNotesList();
    getNodesListCommand.setFolderid(folderId);
    const commandData = base64.stringify(getNodesListCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 3, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const folderProps = GetNotesListResponse.deserializeBinary(buffer).toObject() as GetNotesListResponse.AsObject;
    const notes = folderProps.notesList.map((n: NoteShortInfo.AsObject) => {
      const note: Note = {
        id: n.id,
        title: n.title,
        text: '',
        folderId: n.folderid,
        level: 0,
        createdAt: new Date(n.createdat),
        updatedAt: new Date(n.updatedat),
        userId: 0,
        deletedAt: null
      };
      return note;
    });
    return notes;
  }

  async loadNoteById(id: string): Promise<Note> {
    const getNoteCommand = new GetNoteById();
    getNoteCommand.setNoteid(id);
    const commandData = base64.stringify(getNoteCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 5, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const props = GetNoteByIdResponse.deserializeBinary(buffer).toObject() as GetNoteByIdResponse.AsObject;
    const note: Note = {
      id: props.id,
      title: props.title,
      text: props.text,
      folderId: props.folderid,
      level: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: 0,
      deletedAt: new Date()
    };
    return note;
  }

  async createNote(title: string, text: string, folderId: string): Promise<string> {
    const createNoteCommand = new CreateNote();
    createNoteCommand.setTitle(title);
    createNoteCommand.setText(text);
    createNoteCommand.setFolderid(folderId);
    const commandData = base64.stringify(createNoteCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 2, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const noteProps = CreateNoteResponse.deserializeBinary(buffer).toObject() as CreateNoteResponse.AsObject;
    return noteProps.noteid;
  }

  async createFolder(title: string, parentId: string): Promise<string> {
    const createFolderCommand = new CreateFolder();
    createFolderCommand.setTitle(title);
    createFolderCommand.setParentid(parentId);
    const commandData = base64.stringify(createFolderCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 13, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const folderProps = CreateFolderResponse.deserializeBinary(buffer).toObject() as CreateFolderResponse.AsObject;
    return folderProps.folderid;
  }

  async updateNote(note: Note): Promise<void> {
    const updateCommand = new UpdateNote();
    updateCommand.setId(note.id);
    updateCommand.setFolderid(note.folderId);
    updateCommand.setTitle(note.title);
    updateCommand.setText(note.text);
    const commandData = base64.stringify(updateCommand.serializeBinary());
    await this.runCommand('runCoreCommand', {command : 14, data: commandData});
  }

  async updateFolder(folder: Folder): Promise<void> {
    const updateCommand = new UpdateFolder();
    updateCommand.setId(folder.id);
    updateCommand.setParentid(folder.parentId);
    updateCommand.setTitle(folder.title);
    updateCommand.setLevel(folder.level);
    const commandData = base64.stringify(updateCommand.serializeBinary());
    await this.runCommand('runCoreCommand', {command : 15, data: commandData});
  }

  async synchronize(): Promise<void> {
    return this.runCommand('runCoreCommand', {command : 7});
  }

  async searchNotes(query: string, folderId: string): Promise<Note[]> {
    const searchNotesCommand = new SearchNotes();
    searchNotesCommand.setQuery(query);
    if (folderId != null) {
      searchNotesCommand.setFolderid(folderId);
    }

    const commandData = base64.stringify(searchNotesCommand.serializeBinary());
    const result = await this.runCommand('runCoreCommand', {command : 18, data: commandData});
    const buffer = base64.parse(result, { loose : true});
    const props = GetNotesListResponse.deserializeBinary(buffer).toObject() as GetNotesListResponse.AsObject;
    const notes = props.notesList.map((n: NoteShortInfo.AsObject) => {
        const note: Note = {
          id: n.id,
          title: n.title,
          text: '',
          folderId: n.folderid,
          level: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 0,
          deletedAt: new Date()
        };
        return note;
    });
    return notes;
  }

  async googleSignIn(): Promise<any> {
    return this.runCommand('googleSignIn', {});
  }
}
