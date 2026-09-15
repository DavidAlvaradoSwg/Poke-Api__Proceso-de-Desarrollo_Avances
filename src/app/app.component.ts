import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from './services/pokemon.service';
import { Pokemon } from './models/pokemon.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent implements OnInit {
  private pokemonService = inject(PokemonService)
  pokemons = signal<Pokemon[]>([]);
  searchTerm = signal<string>('');
  loading = signal<boolean>(true);
  errorMessage = signal<string>('');


  filteredPokemons = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.pokemons();
    return this.pokemons().filter(p =>
      p.name.toLowerCase().includes(term) || p.id.toString() === term
    );
  });
  ngOnInit(): void {
    this.loadInitialData();
  }
  loadInitialData(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.pokemonService.getInitialPokemons(24).subscribe({
      next: (data) => {
        this.pokemons.set(data);
        this.loading.set(false);
      }
    });
  }
  searchDirectly(): void {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return;
    this.loading.set(true);
    this.errorMessage.set('');

    this.pokemonService.getPokemonByNameOrId(term).subscribe({
      next: (pokemon) => {
        if (!this.pokemons().some(p => p.id === pokemon.id)) {
          this.pokemons.update(list => [pokemon, ...list]);
        }
        this.loading.set(false);
      },
          error: () => {
            this.errorMessage.set(`No se encontro ningun Pokemon.!"${term}"!`);
            this.loading.set(false);
          }
        });
      }
      getTypeColor(type: string): string {
        const colors: Record<string, string> = {
          fire: '#ff5722',
          water: '#2196f3',
          grass: '#4caf50',
          electric: '#ffeb3b',
          psychic: '#e91e63',
          ice: '#00bcd4',
          dragon: '#673ab7',
          dark: '#424242',
          fairy: '#f48fb1',
          poison: '#9c27b0',
          flying: '#90caf9',
          bug: '#8bc34a',
          rock: '#795548',
          ghost: '#7e57c2',
          ground: '#d7ccc8',
          steel: '#b0bec5',
          normal: '#b0bec5'
        };
        return colors[type.toLowerCase()] || '#757575';

      }
    }
