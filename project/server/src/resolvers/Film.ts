import {
  Arg,
  Field,
  Int,
  ObjectType,
  Query,
  Resolver,
  FieldResolver,
  Root,
} from 'type-graphql';
import ghibliData from '../data/ghibli';
import { Film } from '../entities/Film';
import { Director } from '../entities/Director';

@ObjectType()
class PaginatedFilms {
  @Field(() => [Film])
  films: Film[];

  @Field(() => Int, { nullable: true })
  cursor?: Film['id'] | null;
}

@Resolver(Film)
export class FilmResolver {
  @Query(() => PaginatedFilms)
  films(
    @Arg('limit', () => Int, { nullable: true, defaultValue: 6 })
    limit: number,
    @Arg('cursor', () => Int, { nullable: true, defaultValue: 1 })
    cursor: Film['id'],
    @Arg('keyword', () => String, { nullable: true, defaultValue: '' })
    keyword: string,
  ): PaginatedFilms {
    const realLimit = Math.min(6, limit);

    if (!cursor) return { films: [] };

    let preResult = ghibliData.films;
    if (keyword !== '') {
      // 영화 제목 및 감독이름으로
      const directorsId = ghibliData.directors.map((e) => {
        if (e.name.includes(keyword)) return e.id;
        return null;
      });
      const titleResult = preResult.filter((e) => e.title.includes(keyword));
      const directorResult = preResult.filter((e) =>
        directorsId.includes(e.director_id),
      );

      // 머지 preResult = titleResult.concat(directorResult);
      preResult = Object.assign(titleResult, directorResult);
    }

    if (preResult.length === 0) return { films: [] };

    let cursorDataIndex = preResult.findIndex((f) => f.id === cursor);
    // if (cursorDataIndex === -1) return { films: [] };
    cursorDataIndex = cursorDataIndex === -1 ? 0 : cursorDataIndex;

    const result = preResult.slice(
      cursorDataIndex,
      cursorDataIndex + realLimit,
    );

    const nextCursor = result[result.length - 1].id + 1;
    const hasNext = preResult.findIndex((f) => f.id === nextCursor) > -1;

    return {
      cursor: hasNext ? nextCursor : null,
      films: result,
    };
  }

  @FieldResolver(() => Director)
  director(@Root() parentFilm: Film): Director | undefined {
    return ghibliData.directors.find((dr) => dr.id === parentFilm.director_id);
  }

  @Query(() => Film, { nullable: true })
  film(@Arg('filmId', () => Int) filmId: number): Film | undefined {
    return ghibliData.films.find((x) => x.id === filmId);
  }
}
