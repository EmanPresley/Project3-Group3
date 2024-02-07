# Import the dependencies.
from flask import Flask, jsonify, render_template
import pandas as pd
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sqlHelper = SQLHelper() # initialize the database helper

# home page
@app.route("/")
def home_page():
    return render_template("home.html")

@app.route("/index")
def map_page():
    return render_template("index.html")

# game titles page
@app.route("/games_db")
def studios():
    return render_template("games_db.html")

# about us page
@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/api/v1.0/<Country>")
def get_data(Country):
    print(Country)

    # execute the queries
    data_map = sqlHelper.getMapData(Country)
    data_bar = sqlHelper.getBarData(Country)

    data = {"map_data": data_map,
            "bar_data": data_bar}

    return jsonify(data)

@app.route("/api/v1.0/games/<Category>")
def get_data2(Category):
    print(Category)

    # execute the queries
    data_bar1 = sqlHelper.getBarData1(Category)
    data_bar2 = sqlHelper.getBarData2(Category)

    data = {"bar1_data": data_bar1,
            "bar2_data": data_bar2}

    return jsonify(data)

#################################################
# Execute the App
#################################################
if __name__ == "__main__":
    app.run(debug=True)