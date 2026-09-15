import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, switchMap } from 'rxjs';
import { Pokemon, PokemonListResponse } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private http = inject(HttpClient);
  private baseUrl = 'https://pokeapi.co/api/v2';

  getInitialPokemons(limit = 24): Observable<Pokemon[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=${limit}`).pipe(
      switchMap(response => {
        const detailRequests = response.results.map(p => this.getPokemonByNameOrId(p.name));
        return forkJoin(detailRequests);

      })
    );
  }

getPokemonByNameOrId(query: string | number): Observable<Pokemon> {
  return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${query.toString().toLowerCase().trim()}`);
}}
