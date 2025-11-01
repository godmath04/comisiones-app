import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';


type CommissionRowVm = {
  vendedorId: number;
  vendedor: string;
  totalVentas: number;
  porcentajeAplicado: number;
  comisionCalculada: number;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  apiBase = environment.apiBaseUrl;
  title = 'comisiones-app';


   // Fechas del formulario
  fechaInicio = this.toIsoDate(new Date(new Date().setDate(new Date().getDate()-30)));
  fechaFin    = this.toIsoDate(new Date());

  // Resultados
  filas: CommissionRowVm[] = [];
  cargando = false;
  error = '';

  constructor(private http: HttpClient) {}

  calcular() {
    this.error = '';
    this.cargando = true;
    const body = {
      fechaInicio: `${this.fechaInicio}T00:00:00Z`,
      fechaFin: `${this.fechaFin}T23:59:59Z`
    };
    this.http.post<CommissionRowVm[]>(`${this.apiBase}/api/v1/commission/calculate`, body)
      .subscribe({
        next: (r) => { this.filas = r; this.cargando = false; },
        error: (e) => { this.error = e?.message ?? 'Error desconocido'; this.cargando = false; }
      });
  }

  private toIsoDate(d: Date) {
    // YYYY-MM-DD en zona local, para el input date
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
      .toISOString().slice(0,10);
  }
}
