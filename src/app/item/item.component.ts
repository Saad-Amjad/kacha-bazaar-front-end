import { Component, OnInit, Input } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { ItemService } from './item.service';

interface Items {
  item: Item;
}
interface Item {
  name: string;
  price: number;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  providers: [ItemService]
})
export class ItemComponent implements OnInit {

  itemsCollection: AngularFirestoreCollection<Items>;
  itemDocument: AngularFirestoreDocument<Items>;
  items: any;
  selectedItem: any;
  message: string;
  successMessage: string;
  public snapShot: any;
  public formData: Item = {
    name: '',
    price: 0,
  };
  public selectedItemId: string;
  public searchResults;

  title = 'items';

  constructor(
    private angularfirestore: AngularFirestore,
    private service: ItemService
  ) { }

  ngOnInit() {
    this.itemsCollection = this.angularfirestore.collection('items');
    this.items = this.itemsCollection.snapshotChanges().pipe(
      map(data => {
        return data.map(snap => {
          const data = snap.payload.doc.data() as Items;
          const id = snap.payload.doc.id;
          return { id, data };
        });
      })
    );
  }
  getDetails(item) {
    let { id } = item;
    this.selectedItemId = id;
    this.itemDocument = this.angularfirestore.doc('items/' + id);
    this.itemDocument.valueChanges().subscribe(data => {
      this.selectedItem = data;
    });
  }
}
