from rest_framework import serializers


from apiClinic.models import Patient,Doctor,Bookings


class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
        
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = '__all__'
        
class BookingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bookings
        fields = '__all__'
        
class SpecialtyCountSerializer(serializers.Serializer):
    specialty = serializers.CharField()
    total = serializers.IntegerField()
