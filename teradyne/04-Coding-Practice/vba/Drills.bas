Attribute VB_Name = "Drills"
' Teradyne interview VBA drills, with solutions.
' Import: Excel -> Alt+F11 -> File -> Import File... -> Drills.bas (and Measurement.cls)
' Then run SetupSampleData, followed by each Drill macro (Alt+F8).
Option Explicit

' ---------------------------------------------------------------
' Sample data: sheet "Datalog" with Site | Test | Value | Low | High
' ---------------------------------------------------------------
Public Sub SetupSampleData()
    Dim ws As Worksheet
    On Error Resume Next
    Set ws = ThisWorkbook.Worksheets("Datalog")
    On Error GoTo 0
    If ws Is Nothing Then
        Set ws = ThisWorkbook.Worksheets.Add
        ws.Name = "Datalog"
    End If
    ws.Cells.Clear
    ws.Range("A1:E1").Value = Array("Site", "Test", "Value", "Low", "High")
    ws.Range("A2:E9").Value = SampleRows()
End Sub

Private Function SampleRows() As Variant
    Dim r(1 To 8, 1 To 5) As Variant, data As Variant, i As Long, j As Long
    data = Array( _
        Array(0, "IDD", 1.2, 1, 1.5), Array(0, "LEAK", 0.5, 0, 1), _
        Array(1, "IDD", 1.7, 1, 1.5), Array(1, "LEAK", 2, 0, 1), _
        Array(2, "IDD", 1.1, 1, 1.5), Array(2, "LEAK", 0.9, 0, 1), _
        Array(3, "IDD", 1.3, 1, 1.5), Array(3, "LEAK", 1.1, 0, 1))
    For i = 0 To 7
        For j = 0 To 4
            r(i + 1, j + 1) = data(i)(j)
        Next j
    Next i
    SampleRows = r
End Function

' ---------------------------------------------------------------
' Drill 1: count values in a range that are outside [low, high].
' Usable as a worksheet formula: =CountFailures(C2:C9, 1, 1.5)
' Key points: read the range into an array once (fast), handle a single cell,
' skip non-numeric cells.
' ---------------------------------------------------------------
Public Function CountFailures(rng As Range, lowLimit As Double, highLimit As Double) As Long
    Dim v As Variant, r As Long, c As Long, n As Long
    If rng.Cells.Count = 1 Then
        v = rng.Value
        If IsNumeric(v) And Not IsEmpty(v) Then
            If v < lowLimit Or v > highLimit Then n = 1
        End If
        CountFailures = n
        Exit Function
    End If
    v = rng.Value                                   ' 2-D, 1-based array
    For r = 1 To UBound(v, 1)
        For c = 1 To UBound(v, 2)
            If IsNumeric(v(r, c)) And Not IsEmpty(v(r, c)) Then
                If v(r, c) < lowLimit Or v(r, c) > highLimit Then n = n + 1
            End If
        Next c
    Next r
    CountFailures = n
End Function

' ---------------------------------------------------------------
' Drill 2: per-site pass/fail summary using a Dictionary.
' A site passes only if all its tests are within limits. Writes to sheet "Summary".
' ---------------------------------------------------------------
Public Sub Drill2_SiteSummary()
    Dim ws As Worksheet, out As Worksheet
    Dim data As Variant, lastRow As Long, i As Long
    Dim fails As Object, site As Variant, row As Long, good As Long

    Set ws = ThisWorkbook.Worksheets("Datalog")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    If lastRow < 2 Then Exit Sub
    data = ws.Range("A2:E" & lastRow).Value

    Set fails = CreateObject("Scripting.Dictionary")       ' late binding: no reference needed
    For i = 1 To UBound(data, 1)
        site = CLng(data(i, 1))
        If Not fails.Exists(site) Then fails.Add site, 0
        If data(i, 3) < data(i, 4) Or data(i, 3) > data(i, 5) Then
            fails(site) = fails(site) + 1
        End If
    Next i

    Set out = GetOrCreateSheet("Summary")
    out.Cells.Clear
    out.Range("A1:C1").Value = Array("Site", "Failures", "Result")
    row = 2
    For Each site In fails.Keys
        out.Cells(row, 1).Value = site
        out.Cells(row, 2).Value = fails(site)
        out.Cells(row, 3).Value = IIf(fails(site) = 0, "PASS", "FAIL")
        If fails(site) = 0 Then good = good + 1
        row = row + 1
    Next site
    out.Cells(row + 1, 1).Value = "Yield"
    out.Cells(row + 1, 2).Value = good / fails.Count
    out.Cells(row + 1, 2).NumberFormat = "0.0%"
End Sub

' ---------------------------------------------------------------
' Drill 3: highlight failing rows fast, with proper state restore on error.
' Shows: ScreenUpdating/Calculation off, single exit point, error handler.
' ---------------------------------------------------------------
Public Sub Drill3_HighlightFailures()
    Dim ws As Worksheet, data As Variant, lastRow As Long, i As Long
    Dim oldCalc As XlCalculation
    Dim failRange As Range

    oldCalc = Application.Calculation
    On Error GoTo ErrHandler
    Application.ScreenUpdating = False
    Application.Calculation = xlCalculationManual

    Set ws = ThisWorkbook.Worksheets("Datalog")
    lastRow = ws.Cells(ws.Rows.Count, "A").End(xlUp).Row
    ws.Range("A2:E" & lastRow).Interior.ColorIndex = xlNone
    data = ws.Range("A2:E" & lastRow).Value

    For i = 1 To UBound(data, 1)
        If data(i, 3) < data(i, 4) Or data(i, 3) > data(i, 5) Then
            If failRange Is Nothing Then
                Set failRange = ws.Range("A" & i + 1 & ":E" & i + 1)
            Else
                Set failRange = Union(failRange, ws.Range("A" & i + 1 & ":E" & i + 1))
            End If
        End If
    Next i
    If Not failRange Is Nothing Then failRange.Interior.Color = RGB(255, 199, 206)   ' colour once

CleanExit:
    Application.ScreenUpdating = True
    Application.Calculation = oldCalc
    Exit Sub
ErrHandler:
    Debug.Print "Drill3_HighlightFailures error " & Err.Number & ": " & Err.Description
    MsgBox "Error " & Err.Number & ": " & Err.Description, vbExclamation
    Resume CleanExit
End Sub

' ---------------------------------------------------------------
' Drill 4: import a CSV datalog file into a sheet (no Workbooks.Open).
' Shows: file I/O, Split, ReDim, writing a 2-D array in one call.
' ---------------------------------------------------------------
Public Sub Drill4_ImportCsv()
    Dim path As Variant, f As Integer, text As String, lines() As String
    Dim out() As Variant, parts() As String, i As Long, j As Long, n As Long, cols As Long

    path = Application.GetOpenFilename("CSV files (*.csv),*.csv")
    If path = False Then Exit Sub

    f = FreeFile
    Open path For Input As #f
    text = Input$(LOF(f), f)
    Close #f

    text = Replace(text, vbCrLf, vbLf)
    lines = Split(text, vbLf)
    cols = UBound(Split(lines(0), ",")) + 1
    ReDim out(1 To UBound(lines) + 1, 1 To cols)

    For i = 0 To UBound(lines)
        If Len(Trim$(lines(i))) > 0 Then
            n = n + 1
            parts = Split(lines(i), ",")
            For j = 0 To cols - 1
                If j <= UBound(parts) Then
                    If IsNumeric(parts(j)) Then out(n, j + 1) = Val(parts(j)) Else out(n, j + 1) = Trim$(parts(j))
                End If
            Next j
        End If
    Next i

    With GetOrCreateSheet("Imported")
        .Cells.Clear
        If n > 0 Then .Range("A1").Resize(n, cols).Value = out    ' one write call
    End With
End Sub

' ---------------------------------------------------------------
' Drill 5: use the Measurement class (Measurement.cls) - VBA OOP.
' ---------------------------------------------------------------
Public Sub Drill5_ClassDemo()
    Dim m As Measurement
    Set m = New Measurement
    m.Init 1, "IDD", 1.7, 1, 1.5
    Debug.Print m.Describe            ' Site 1 IDD = 1.7 [1..1.5] FAIL
End Sub

' ---------------------------------------------------------------
' Drill 6: timing code (64-bit safe) - measure how long a block takes.
' ---------------------------------------------------------------
Public Sub Drill6_Timing()
    Dim t As Double, i As Long, s As Double
    t = Timer
    For i = 1 To 5000000
        s = s + Sqr(i)
    Next i
    Debug.Print "Took " & Format$(Timer - t, "0.000") & " s"
End Sub

' ---------------------------------------------------------------
' Helpers
' ---------------------------------------------------------------
Private Function GetOrCreateSheet(name As String) As Worksheet
    On Error Resume Next
    Set GetOrCreateSheet = ThisWorkbook.Worksheets(name)
    On Error GoTo 0
    If GetOrCreateSheet Is Nothing Then
        Set GetOrCreateSheet = ThisWorkbook.Worksheets.Add(After:=ThisWorkbook.Worksheets(ThisWorkbook.Worksheets.Count))
        GetOrCreateSheet.Name = name
    End If
End Function
