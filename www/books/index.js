// Alle Bücher der App. Neues Buch: Ordner unter books/ anlegen und hier an beiden Stellen eintragen.
import villaMorgenrot from './villa-morgenrot/book.js';
import augeDesJaguars from './auge-des-jaguars/book.js';

export const BOOKS = [villaMorgenrot, augeDesJaguars];
// Ordner der Bücher (für die Übersetzungsdateien), gleiche Reihenfolge wie BOOKS
export const BOOK_DIRS = ['books/villa-morgenrot', 'books/auge-des-jaguars'];
