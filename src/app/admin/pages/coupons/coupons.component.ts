import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrl: './coupons.component.scss'
})
export class CouponsComponent implements OnInit {
  coupons: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'discount', 'code', 'expirationDate'];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.getCoupons();
  }

  getCoupons(): void {
    this.adminService.getCoupons().subscribe(res => {
      this.coupons = res;
    });
  }
}
