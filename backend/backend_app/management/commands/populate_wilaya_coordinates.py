from django.core.management.base import BaseCommand
from backend_app.models import Wilaya
from decimal import Decimal

class Command(BaseCommand):
    help = 'Populate Wilaya coordinates for all 58 Algerian wilayas'

    def handle(self, *args, **options):
        wilaya_coordinates = [
            {"code": "01", "name": "Adrar", "longitude": "-0.285869", "latitude": "27.873279"},
            {"code": "02", "name": "Chlef", "longitude": "1.950000", "latitude": "36.166667"},
            {"code": "03", "name": "Laghouat", "longitude": "2.916667", "latitude": "33.800000"},
            {"code": "04", "name": "Oum El Bouaghi", "longitude": "7.116667", "latitude": "35.866667"},
            {"code": "05", "name": "Batna", "longitude": "6.183333", "latitude": "35.550000"},
            {"code": "06", "name": "Béjaïa", "longitude": "5.083333", "latitude": "36.750000"},
            {"code": "07", "name": "Biskra", "longitude": "5.733333", "latitude": "34.850000"},
            {"code": "08", "name": "Béchar", "longitude": "-2.200000", "latitude": "31.616667"},
            {"code": "09", "name": "Blida", "longitude": "2.816667", "latitude": "36.483333"},
            {"code": "10", "name": "Bouira", "longitude": "3.900000", "latitude": "36.350000"},
            {"code": "11", "name": "Tamanrasset", "longitude": "5.516667", "latitude": "22.783333"},
            {"code": "12", "name": "Tébessa", "longitude": "8.116667", "latitude": "35.400000"},
            {"code": "13", "name": "Tlemcen", "longitude": "-1.316667", "latitude": "34.883333"},
            {"code": "14", "name": "Tiaret", "longitude": "1.316667", "latitude": "35.383333"},
            {"code": "15", "name": "Tizi Ouzou", "longitude": "4.050000", "latitude": "36.716667"},
            {"code": "16", "name": "Alger", "longitude": "3.050000", "latitude": "36.750000"},
            {"code": "17", "name": "Djelfa", "longitude": "3.250000", "latitude": "34.666667"},
            {"code": "18", "name": "Jijel", "longitude": "5.766667", "latitude": "36.816667"},
            {"code": "19", "name": "Sétif", "longitude": "5.383333", "latitude": "36.183333"},
            {"code": "20", "name": "Saïda", "longitude": "0.150000", "latitude": "34.833333"},
            {"code": "21", "name": "Skikda", "longitude": "6.900000", "latitude": "36.866667"},
            {"code": "22", "name": "Sidi Bel Abbès", "longitude": "0.633333", "latitude": "35.200000"},
            {"code": "23", "name": "Annaba", "longitude": "7.750000", "latitude": "36.900000"},
            {"code": "24", "name": "Guelma", "longitude": "7.433333", "latitude": "36.466667"},
            {"code": "25", "name": "Constantine", "longitude": "6.600000", "latitude": "36.366667"},
            {"code": "26", "name": "Médéa", "longitude": "2.750000", "latitude": "36.266667"},
            {"code": "27", "name": "Mostaganem", "longitude": "0.083333", "latitude": "35.916667"},
            {"code": "28", "name": "M'Sila", "longitude": "4.550000", "latitude": "35.700000"},
            {"code": "29", "name": "Mascara", "longitude": "0.133333", "latitude": "35.400000"},
            {"code": "30", "name": "Ouargla", "longitude": "5.333333", "latitude": "31.950000"},
            {"code": "31", "name": "Oran", "longitude": "-0.650000", "latitude": "35.700000"},
            {"code": "32", "name": "El Bayadh", "longitude": "1.000000", "latitude": "33.700000"},
            {"code": "33", "name": "Illizi", "longitude": "8.466667", "latitude": "26.483333"},
            {"code": "34", "name": "Bordj Bou Arréridj", "longitude": "4.766667", "latitude": "36.066667"},
            {"code": "35", "name": "Boumerdès", "longitude": "3.466667", "latitude": "36.766667"},
            {"code": "36", "name": "El Tarf", "longitude": "8.300000", "latitude": "36.766667"},
            {"code": "37", "name": "Tindouf", "longitude": "-8.133333", "latitude": "27.683333"},
            {"code": "38", "name": "Tissemsilt", "longitude": "1.800000", "latitude": "35.600000"},
            {"code": "39", "name": "El Oued", "longitude": "7.166667", "latitude": "33.366667"},
            {"code": "40", "name": "Khenchela", "longitude": "7.150000", "latitude": "35.433333"},
            {"code": "41", "name": "Souk Ahras", "longitude": "7.950000", "latitude": "36.283333"},
            {"code": "42", "name": "Tipaza", "longitude": "2.433333", "latitude": "36.600000"},
            {"code": "43", "name": "Mila", "longitude": "6.250000", "latitude": "36.433333"},
            {"code": "44", "name": "Aïn Defla", "longitude": "1.966667", "latitude": "36.266667"},
            {"code": "45", "name": "Naâma", "longitude": "0.316667", "latitude": "33.266667"},
            {"code": "46", "name": "Aïn Témouchent", "longitude": "-1.133333", "latitude": "35.300000"},
            {"code": "47", "name": "Ghardaïa", "longitude": "3.666667", "latitude": "32.483333"},
            {"code": "48", "name": "Relizane", "longitude": "0.550000", "latitude": "35.733333"},
            {"code": "49", "name": "Timimoun", "longitude": "0.233333", "latitude": "29.250000"},
            {"code": "50", "name": "Bordj Badji Mokhtar", "longitude": "0.266667", "latitude": "21.366667"},
            {"code": "51", "name": "Ouled Djellal", "longitude": "5.083333", "latitude": "34.333333"},
            {"code": "52", "name": "Béni Abbès", "longitude": "-2.166667", "latitude": "29.566667"},
            {"code": "53", "name": "In Salah", "longitude": "2.483333", "latitude": "27.250000"},
            {"code": "54", "name": "In Guezzam", "longitude": "5.769444", "latitude": "19.572222"},
            {"code": "55", "name": "Touggourt", "longitude": "6.066667", "latitude": "33.100000"},
            {"code": "56", "name": "Djanet", "longitude": "9.500000", "latitude": "24.550000"},
            {"code": "57", "name": "El M'Ghair", "longitude": "6.100000", "latitude": "34.133333"},
            {"code": "58", "name": "El Menia", "longitude": "2.883333", "latitude": "28.583333"}
        ]

        updated_count = 0
        for wilaya_data in wilaya_coordinates:
            try:
                wilaya = Wilaya.objects.get(code=wilaya_data['code'])
                wilaya.latitude = Decimal(wilaya_data['latitude'])
                wilaya.longitude = Decimal(wilaya_data['longitude'])
                wilaya.save()
                updated_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Updated {wilaya.name} ({wilaya.code})')
                )
            except Wilaya.DoesNotExist:
                self.stdout.write(
                    self.style.WARNING(f'✗ Wilaya {wilaya_data["code"]} not found in database')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'✗ Error updating {wilaya_data["code"]}: {str(e)}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully updated {updated_count} wilayas with coordinates')
        )
