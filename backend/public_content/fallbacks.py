# Fallback content shown when the DB is empty or unavailable.
# Structure mirrors OfferSerializer / TripBonusSerializer fields.

FALLBACK_OFFERS = [
    {
        "id": -1,
        "title": "Free Safety Helmet",
        "description": (
            "Register your bike and complete 250 trips to receive a FREE "
            "certified Yango safety helmet. No extra cost - just ride and earn."
        ),
        "badge": "Bike Only",
        "priority": 1,
        "image": None,
        "is_active": True,
        "start_date": None,
        "end_date": None,
    },
    {
        "id": -2,
        "title": "Welcome Top-Up Bonus",
        "description": (
            "New bike, car and rickshaw drivers receive a PKR 500 welcome "
            "bonus credited instantly after completing your very first trip. "
            "No conditions. No waiting."
        ),
        "badge": "All Vehicles",
        "priority": 2,
        "image": None,
        "is_active": True,
        "start_date": None,
        "end_date": None,
    },
    {
        "id": -3,
        "title": "Free Vehicle Branding",
        "description": (
            "Get your car or rickshaw branded with official Yango livery at "
            "zero cost. Branded vehicles enjoy priority request allocation "
            "and significantly higher earning potential on every shift."
        ),
        "badge": "Car & Rickshaw",
        "priority": 3,
        "image": None,
        "is_active": True,
        "start_date": None,
        "end_date": None,
    },
]

# Lahore trip bonus slabs only.
FALLBACK_TRIP_BONUSES = [
    # Bike
    {"id": -101, "city": "Lahore", "vehicle_type": "bike", "trip_target": 2, "bonus_amount": "180.00", "notes": "Daily bonus", "sort_order": 10, "is_active": True},
    {"id": -102, "city": "Lahore", "vehicle_type": "bike", "trip_target": 4, "bonus_amount": "365.00", "notes": "Daily bonus", "sort_order": 11, "is_active": True},
    {"id": -103, "city": "Lahore", "vehicle_type": "bike", "trip_target": 7, "bonus_amount": "640.00", "notes": "Daily bonus", "sort_order": 12, "is_active": True},
    {"id": -104, "city": "Lahore", "vehicle_type": "bike", "trip_target": 10, "bonus_amount": "920.00", "notes": "Daily bonus", "sort_order": 13, "is_active": True},
    {"id": -105, "city": "Lahore", "vehicle_type": "bike", "trip_target": 13, "bonus_amount": "1200.00", "notes": "Daily bonus", "sort_order": 14, "is_active": True},
    {"id": -106, "city": "Lahore", "vehicle_type": "bike", "trip_target": 15, "bonus_amount": "1390.00", "notes": "Daily bonus", "sort_order": 15, "is_active": True},
    {"id": -107, "city": "Lahore", "vehicle_type": "bike", "trip_target": 17, "bonus_amount": "1580.00", "notes": "Daily bonus", "sort_order": 16, "is_active": True},
    {"id": -108, "city": "Lahore", "vehicle_type": "bike", "trip_target": 19, "bonus_amount": "1770.00", "notes": "Daily bonus", "sort_order": 17, "is_active": True},

    # Rickshaw
    {"id": -201, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 2, "bonus_amount": "220.00", "notes": "Daily bonus", "sort_order": 20, "is_active": True},
    {"id": -202, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 5, "bonus_amount": "550.00", "notes": "Daily bonus", "sort_order": 21, "is_active": True},
    {"id": -203, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 8, "bonus_amount": "880.00", "notes": "Daily bonus", "sort_order": 22, "is_active": True},
    {"id": -204, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 10, "bonus_amount": "1100.00", "notes": "Daily bonus", "sort_order": 23, "is_active": True},
    {"id": -205, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 12, "bonus_amount": "1330.00", "notes": "Daily bonus", "sort_order": 24, "is_active": True},
    {"id": -206, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 14, "bonus_amount": "1550.00", "notes": "Daily bonus", "sort_order": 25, "is_active": True},
    {"id": -207, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 16, "bonus_amount": "1780.00", "notes": "Daily bonus", "sort_order": 26, "is_active": True},
    {"id": -208, "city": "Lahore", "vehicle_type": "rickshaw", "trip_target": 18, "bonus_amount": "2000.00", "notes": "Daily bonus", "sort_order": 27, "is_active": True},

    # Car
    {"id": -301, "city": "Lahore", "vehicle_type": "car", "trip_target": 2, "bonus_amount": "260.00", "notes": "Daily bonus", "sort_order": 30, "is_active": True},
    {"id": -302, "city": "Lahore", "vehicle_type": "car", "trip_target": 5, "bonus_amount": "650.00", "notes": "Daily bonus", "sort_order": 31, "is_active": True},
    {"id": -303, "city": "Lahore", "vehicle_type": "car", "trip_target": 8, "bonus_amount": "1050.00", "notes": "Daily bonus", "sort_order": 32, "is_active": True},
    {"id": -304, "city": "Lahore", "vehicle_type": "car", "trip_target": 10, "bonus_amount": "1310.00", "notes": "Daily bonus", "sort_order": 33, "is_active": True},
    {"id": -305, "city": "Lahore", "vehicle_type": "car", "trip_target": 12, "bonus_amount": "1580.00", "notes": "Daily bonus", "sort_order": 34, "is_active": True},
    {"id": -306, "city": "Lahore", "vehicle_type": "car", "trip_target": 14, "bonus_amount": "1840.00", "notes": "Daily bonus", "sort_order": 35, "is_active": True},
    {"id": -307, "city": "Lahore", "vehicle_type": "car", "trip_target": 16, "bonus_amount": "2100.00", "notes": "Daily bonus", "sort_order": 36, "is_active": True},
    {"id": -308, "city": "Lahore", "vehicle_type": "car", "trip_target": 18, "bonus_amount": "2370.00", "notes": "Daily bonus", "sort_order": 37, "is_active": True},
]
