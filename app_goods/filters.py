from .models import GoodType, GoodVariant
from django import forms
import django_filters

CHOICES = [(status.name, status.name) for status in GoodType.objects.all()]


class GoodTypeFilter(django_filters.FilterSet):
    name = django_filters.MultipleChoiceFilter(
        choices=CHOICES,
        widget=forms.CheckboxSelectMultiple(),
    )

    class Meta:
        model = GoodType
        fields = {
            "name": ["exact"],
        }


class GoodVariantFilter(django_filters.FilterSet):
    good__good_type__name = django_filters.MultipleChoiceFilter(
        field_name="good__good_type__name",
        choices=CHOICES,
        widget=forms.CheckboxSelectMultiple(),
        label="Good Type Name",
    )

    is_top = django_filters.BooleanFilter(
        field_name="is_top",
        widget=forms.CheckboxInput(),
        label="Show Only Top Goods",
        method='filter_is_top'
    )

    class Meta:
        model = GoodVariant
        fields = ["good__good_type__name", "is_top"]

    def filter_is_top(self, queryset, name, value):
        if value is False:
            return queryset
        return queryset.filter(**{name: value})

