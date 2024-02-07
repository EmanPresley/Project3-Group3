import sqlalchemy
from sqlalchemy import create_engine, func, inspect, text
import pandas as pd

class SQLHelper():

    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/video_games_final.sqlite")

    def getMapData(self, Country):
        # allow the user to select ALL or a specific Country
        if Country == "All":
            where_clause = "1=1"
        else:
            where_clause = f"Country = '{Country}'"

        # USE RAW SQL
        query = f"""
                SELECT
                    *
                FROM
                    merged_df
                WHERE
                    {where_clause}
                    and latitude is not null
                    and longitude is not null
        """

        df_map = pd.read_sql(text(query), con=self.engine)
        data_map = df_map.to_dict(orient="records")

        return(data_map)

    def getBarData(self, Country):
        # allow the user to select ALL or a specific Country
        if Country == "All":
            where_clause = "1=1"
        else:
            where_clause = f"Country = '{Country}'"


        query = f"""
                SELECT
                    Country,
                    count(*) as num_studios
                FROM
                    merged_df
                WHERE
                    {where_clause}
                    and latitude is not null
                    and longitude is not null
                GROUP BY
                    Country
                ORDER BY
                    num_studios desc
                LIMIT 10;
        """

        df_bar = pd.read_sql(text(query), con=self.engine)
        data_bar = df_bar.to_dict(orient="records")

        return(data_bar)


    def getBarData1(self, Category):
                # allow the user to select the most played title 
        if Category == "genre":
            query = f"""
                    SELECT
                        Genres as labels,
                        count(*) as "values"
                    FROM
                        games
                    GROUP BY
                        Genres
                    ORDER BY
                        "values" desc
                    LIMIT 10;
                """
        elif Category == "rating":
            query = f"""
                    SELECT
                        Title as labels,
                        Rating as "values"
                    FROM
                        games
                    GROUP BY
                        Title
                    ORDER BY
                        "values" desc
                    LIMIT 10;
                """
        else:
            query =  f"""
                    SELECT
                        Title as labels,
                        Plays as "values"
                    FROM
                        games
                    GROUP BY
                        Title
                    ORDER BY
                        "values" desc
                    LIMIT 10;
                """

        df2 = pd.read_sql(text(query), con=self.engine)
        bar1_data = df2.to_dict(orient="records")
        return(bar1_data)

    def getBarData2(self, Category):
                # allow the user to select the most played title 
        if Category == "genre":
            query = f"""
                    SELECT
                        Genres as labels,
                        count(*) as "values"
                    FROM
                        games
                    GROUP BY
                        Genres
                    ORDER BY
                        "values" asc
                    LIMIT 10;
                """
        elif Category == "rating":
            query = f"""
                    SELECT
                        Title as labels,
                        Rating as "values"
                    FROM
                        games
                    GROUP BY
                        Title
                    ORDER BY
                        "values" asc
                    LIMIT 10;
                """
        else:
            query =  f"""
                    SELECT
                        Title as labels,
                        Plays as "values"
                    FROM
                        games
                    GROUP BY
                        Title
                    ORDER BY
                        "values" asc
                    LIMIT 10;
                """

        df3 = pd.read_sql(text(query), con=self.engine)
        bar2_data = df3.to_dict(orient="records")
        return(bar2_data)
